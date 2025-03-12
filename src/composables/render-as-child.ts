import {
  cloneVNode,
  Comment,
  Fragment,
  getCurrentInstance,
  mergeProps,
  Text,
  useAttrs,
  useSlots,
  type VNode,
} from 'vue';

export const COMPONENT_ERROR_MESSAGES = {
  NO_CHILDREN: (componentName: string) =>
    `[vex]: <${componentName}> requires exactly one child element, but none found.`,
  MULTIPLE_CHILDREN: (componentName: string, count: number) =>
    `[vex]: <${componentName}> requires exactly one child element. Found ${count} children.`,
} as const;

/**
 * renders the component as its child element
 *
 * @param props Props to pass to the component
 */
export function useRenderAsChild(
  slots?: Record<string, any>
): (props?: Record<string, any>) => VNode {
  slots ??= useSlots();
  const attrs = useAttrs();

  return (props: Record<string, any> = {}) => {
    const children = normalizeSlotNodes(normalizeChildren(slots.default?.()));
    const child = validateRootChild(children);
    return cloneVNode(child, mergeProps(attrs, child.props ?? {}, props), true);
  };
}

function normalizeChildren(children: unknown): VNode[] {
  if (!children) return [];
  return Array.isArray(children) ? children : [children as VNode];
}

/**
 * Normalizes VNodes from slot content by handling Vue's special cases:
 * 1. Removes comment nodes that appear when v-if conditions are false
 * 2. Flattens fragment nodes that wrap v-for generated content
 *
 * Example cases handled:
 * ```vue
 * <MyComponent>
 *   <div v-if="condition">...</div>    <!-- Removes comment node when condition is false -->
 *   <div v-for="i in 3">{{ i }}</div>  <!-- Flattens fragment wrapper from v-for -->
 * </MyComponent>
 * ```
 *
 * @param nodes Array of VNodes to normalize
 * @returns Flattened array of valid VNodes with comments removed
 */
function normalizeSlotNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    // Skip comment nodes (v-if false case)
    if (node.type === Comment || node.type === Text) {
      return [];
    }

    // Handle Fragment nodes (v-for case)
    if (node.type === Fragment) {
      return normalizeSlotNodes((node.children as VNode[]) ?? []);
    }

    return [node];
  });
}

function validateRootChild(nodes: VNode[]): VNode {
  const componentName = getComponentName();

  if (nodes.length === 0) {
    throw new Error(COMPONENT_ERROR_MESSAGES.NO_CHILDREN(componentName));
  }

  if (nodes.length > 1) {
    throw new Error(COMPONENT_ERROR_MESSAGES.MULTIPLE_CHILDREN(componentName, nodes.length));
  }

  return nodes[0];
}

function getComponentName(): string {
  const instance = getCurrentInstance();
  return instance?.type.name || instance?.parent?.type.name || 'Unknown Component';
}
