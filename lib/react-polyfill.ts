// Polyfill for findDOMNode in React 19
// react-quill uses findDOMNode which was removed in React 19
// This is a minimal polyfill that provides basic functionality

export function applyFindDOMNodePolyfill() {
  if (typeof window === "undefined") {
    return
  }

  try {
    const ReactDOM = require("react-dom")
    
    if (!ReactDOM.findDOMNode) {
      // @ts-ignore
      ReactDOM.findDOMNode = function(componentOrElement: any) {
        if (componentOrElement == null) {
          return null
        }
        // If it's already a DOM node, return it
        if (componentOrElement.nodeType === 1) {
          return componentOrElement
        }
        // Try to get the DOM node from React internals (React 19 structure)
        if (componentOrElement._reactInternalInstance) {
          let instance = componentOrElement._reactInternalInstance
          while (instance) {
            if (instance.stateNode && instance.stateNode.nodeType === 1) {
              return instance.stateNode
            }
            instance = instance.return
          }
        }
        // Try fiber structure
        if (componentOrElement._reactInternalFiber) {
          let fiber = componentOrElement._reactInternalFiber
          while (fiber) {
            if (fiber.stateNode && fiber.stateNode.nodeType === 1) {
              return fiber.stateNode
            }
            fiber = fiber.return
          }
        }
        // Try ref
        if (componentOrElement.ref && typeof componentOrElement.ref === "object" && componentOrElement.ref.current) {
          return componentOrElement.ref.current
        }
        // Last resort: return null
        return null
      }
    }
  } catch (e) {
    // Polyfill failed, but that's okay - react-quill might still work
    console.warn("findDOMNode polyfill failed:", e)
  }
}

// Auto-apply on import
applyFindDOMNodePolyfill()

