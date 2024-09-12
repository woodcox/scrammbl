// Based on XEM's mini drag and drop - https://xem.github.io/miniDragAndDrop/

function createMiniDND() {
    // Initialize the D object with default values
    let D = {
      w: 0, // Flag to indicate dragging state
      g: null, // The element being dragged
      n: null, // The clone of the dragged element
      X: 0, // X position of the pointer
      Y: 0, // Y position of the pointer
      x: 0, // Offset X within the dragged element
      y: 0, // Offset Y within the dragged element
      p: null, // The potential drop target
      f: null, // The final placed element
      o: null, // The original container of the dragged element
      lastHighlight: null, // Last highlighted container
      activeTouchId: null, // Identifier of the active
      droppedHistory: [] // Initialize the dropped history array
    };
  
    function triggerEvent(eventName, data) {
      const event = new CustomEvent(eventName, { detail: { data } });
      document.dispatchEvent(event);
    }
  
    // A utility function to extract important data from an element
    function extractElementData(element) {
      if (!element) return null;
  
      return {
        id: element.id ?? "", // Default to an empty string if id is not present
        classList: Array.from(element.classList ?? []), // Convert classList to an array
        dataset: { ...element.dataset } ?? {} // Copy the dataset object
        // Add any other attributes you want to track
      };
    }
  
    // Validation function to ensure no conflicting classes
    const validateContainerClasses = (container) => {
      const hasCopy = container.classList.contains("copy");
      const hasDelete = container.classList.contains("delete");
      const hasSwap = container.classList.contains("swap");
  
      // Count how many of these classes are present
      const classCount = [hasCopy, hasDelete, hasSwap].filter(Boolean).length;
  
      if (classCount > 1) {
        console.error(
          "Error: A container should not have more than one of .copy, .delete, or .swap classes."
        );
        return false; // Return false if there's an error
      }
  
      return true; // Return true if the validation passes
    };
  
    // Function to handle pointer down events (mouse down or touch start)
    const pointerdown = (e) => {
      // If a touch event is already active, ignore additional touches
      if (D.activeTouchId !== null && e.type.startsWith("touch")) return; // Ignore if there's already an active touch
  
      e.preventDefault(); // Prevent default behavior
  
      D.w = 1; // Set flag to indicate dragging started
      D.g = null; // Initialize grabbed element
      D.n = null; // Initialize the new element
      D.o = null; // Initialize original container
  
      if (e.touches) {
        D.activeTouchId = e.touches[0].identifier;
        // If it's a touch event, get the element under the first touch point
        D.g = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);
        D.activeTouchId = e.touches[0].identifier; // Set the active touch ID for this drag
        // console.log("ActiveTouchDown", D.activeTouchId);
      } else {
        // Otherwise, use the event target
        D.g = e.target;
      }
  
      // Traverse up the DOM tree to find an element with class "drag"
      while (D.g != document && !D.g.classList.contains("drag")) {
        D.g = D.g.parentNode;
      }
  
      if (D.g == document) {
        D.g = null; // No draggable element found
      } else {
        // Store the original container
        D.o = D.g.parentNode;
  
        // Validate container classes before proceeding
        if (!validateContainerClasses(D.o)) {
          return; // Exit the function if validation fails
        }
  
        // Check if parent has "move" or "copy" class
        if (
          D.g.parentNode.classList.contains("move") ||
          D.g.parentNode.classList.contains("copy")
        ) {
          // Get the pointer position
          D.X = e.touches ? e.touches[0].pageX : e.pageX;
          D.Y = e.touches ? e.touches[0].pageY : e.pageY;
          D.x = D.X - e.target.offsetLeft;
          D.y = D.Y - e.target.offsetTop;
  
          // Create a clone of the dragged element
          D.n = document.body.appendChild(D.g.cloneNode(true));
          D.n.setAttribute("data-moving", "true"); // Add data attribute while moving
  
          if (D.g.parentNode.classList.contains("move")) {
            D.g.style.visibility = "hidden"; // Hide the original element if moving
            D.g.m = 1; // Mark as moved
          }
  
          // Set up the clone element's style
          D.n.style.position = "fixed";
          D.n.style.pointerEvents = "none";
          D.n.style.left = D.X - D.x - 8 + "px";
          D.n.style.top = D.Y - D.y - 8 + "px";
        }
      }
    };
  
    // Function to handle pointer move events (mouse move or touch move)
    const pointermove = (e) => {
      e.preventDefault(); // Prevent default behavior
  
      if (D.w && D.n) {
        // Check if the current touch matches the active touch ID
        if (e.touches && D.activeTouchId !== null) {
          const currentTouch = Array.from(e.touches).find(
            (touch) => touch.identifier === D.activeTouchId
          );
          if (!currentTouch) return;
          D.X = currentTouch.pageX;
          D.Y = currentTouch.pageY;
        } else {
          D.X = e.pageX;
          D.Y = e.pageY;
        }
  
        // console.log("ActiveTouchMove", D.activeTouchId);
  
        // Update the position of the new element
        D.n.style.left = D.X - D.x - 8 + "px";
        D.n.style.top = D.Y - D.y - 8 + "px";
  
        // Determine the current drop target
        if (e.touches) {
          D.p = document.elementFromPoint(D.X, D.Y);
        } else {
          D.p = e.target;
        }
  
        // Traverse up to find an element with the drop class
        while (D.p != document && !D.p.classList.contains("drop")) {
          D.p = D.p.parentNode;
        }
  
        // Remove any previous highlights
        if (D.lastHighlight && D.lastHighlight !== D.p) {
          D.lastHighlight.removeAttribute("data-highlight");
        }
  
        if (D.p != document) {
          // If over a valid drop target, highlight it
          D.p.setAttribute("data-highlight", "true");
          D.lastHighlight = D.p; // Remember the last highlighted element
        } else {
          // If not over a valid drop target, highlight the original container
          D.o.setAttribute("data-highlight", "true");
          D.lastHighlight = D.o; // Remember the original container as the last highlight
        }
      }
    };
  
    // Function to handle pointer up events (mouse up or touch end)
    const pointerup = (e) => {
      if (!D.w) return;
  
      e.preventDefault(); // Prevent default behavior
  
      if (e.touches && D.activeTouchId !== null) {
        const currentTouch = Array.from(e.changedTouches).find(
          (touch) => touch.identifier === D.activeTouchId
        );
        if (!currentTouch) return;
      }
  
      // console.log("ActiveTouchUp", D.activeTouchId);
  
      D.w = 0; // Reset dragging flag
      D.activeTouchId = null; // Reset the active touch ID after the drag ends
  
      if (e.touches) {
        D.p = document.elementFromPoint(D.X, D.Y);
      } else {
        D.p = e.target;
      }
  
      if (D.n) {
        // Remove highlight from all containers
        if (D.lastHighlight) {
          D.lastHighlight.removeAttribute("data-highlight");
        }
        // If a new element was created during dragging
        // Traverse up the DOM tree to find an element with class "drop"
        while (D.p != document && !D.p.classList.contains("drop")) {
          D.p = D.p.parentNode;
        }
  
        D.n.removeAttribute("data-moving"); // Remove data attribute after drop and before its cloned
  
        if (D.p != document) {
          // If a valid drop target was found
          if (D.p.classList.contains("delete")) {
            // If the container has the "delete" class
            D.n.remove(); // Always remove the clone
            if (!D.g.parentNode.classList.contains("copy")) {
              D.g.remove(); // Remove the original element if not from a copy container
            }
          } else if (D.p.classList.contains("swap")) {
            // If the container has the "swap" class
            const existingChild = D.p.querySelector(".drag");
            if (existingChild) {
              D.o.appendChild(existingChild); // Move the existing child to the original container
              resetElementStyle(existingChild);
  
              // If the original element was from a copy container, remove it from there
              if (D.g.parentNode.classList.contains("copy")) {
                D.g.remove(); // Remove the original element from the copy container
              }
            }
            D.f = D.p.appendChild(D.n.cloneNode(true));
            resetElementStyle(D.f);
            D.n.remove(); // Remove the clone after appending its clone to the drop target
            if (D.g.m) {
              D.g.remove(); // Remove the original element after a successful swap
            }
          } else {
            D.f = D.p.appendChild(D.n.cloneNode(true));
            resetElementStyle(D.f);
            D.n.remove(); // Remove the clone after appending its clone to the drop target
            if (D.g.m) {
              D.g.remove(); // Remove the original element after a successful drop
            }
          }
        } else {
          // If dropped outside any valid drop container
          D.n.remove(); // Remove the temporary dragging element
          D.g.style.visibility = ""; // Show the original element again
          D.o.appendChild(D.g); // Put it back in its original container
          // Ensure the potential drop target matched the original container when it returns to its original container
          D.p = D.o;
        }
  
        // Create the dropped history event data
        const droppedData = extractElementData(D.n);
        const dropTargetData = extractElementData(D.p);
        const originalContainer = extractElementData(D.o);
  
        D.droppedHistory.push({
          past: originalContainer,
          container: dropTargetData,
          item: droppedData
        });
  
        triggerEvent("dropped", {
          past: originalContainer,
          container: dropTargetData,
          item: droppedData
        });
      }
    };
  
    // Function to reset the style of an element
    const resetElementStyle = (element) => {
      element.style.position = "";
      element.style.pointerEvents = "";
      element.style.left = "";
      element.style.top = "";
    };
  
    // Add event listeners for mouse and touch events
    document.addEventListener("mousedown", pointerdown);
    document.addEventListener("touchstart", pointerdown);
    document.addEventListener("mousemove", pointermove);
    document.addEventListener("touchmove", pointermove, { passive: false });
    document.addEventListener("mouseup", pointerup);
    document.addEventListener("touchend", pointerup);
  
    return {
      onDrop(callback) {
        document.addEventListener("dropped", callback);
      }
    };
  }
  
  //export default createMiniDND;
