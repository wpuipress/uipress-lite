import Sortable from './sortable.esm.js';
import { defineComponent, h, resolveComponent } from './vue-esm.js';

function getConsole() {
  if (typeof window !== 'undefined') {
    return window.console;
  }
  return global.console;
}
const console = getConsole();

function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

const regex = /-(\w)/g;
const camelize = cached((str) => str.replace(regex, (_, c) => (c ? c.toUpperCase() : '')));

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  const refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}

function computeVmIndex(vnodes, element) {
  return Object.values(vnodes).indexOf(element);
}
function computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return [];
  }
  const elmFromNodes = Object.values(slots);
  const footerIndex = children.length - footerOffset;
  const rawIndexes = [...children].map((elt, idx) => (idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt)));
  return rawIndexes;
}
function emit(evtName, evtData) {
  //@ts-ignore
  this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}
function delegateAndEmit(evtName) {
  //@ts-ignore
  return (evtData) => {
    //@ts-ignore
    if (this.realList !== null) {
      //@ts-ignore
      this['onDrag' + evtName](evtData);
    }
    //@ts-ignore
    emit.call(this, evtName, evtData);
  };
}
function isTransitionName(name) {
  return ['transition-group', 'TransitionGroup'].includes(name);
}
function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }
  // @ts-ignore
  const [{ type }] = slots;
  if (!type) {
    return false;
  }
  //@ts-ignore
  return isTransitionName(type.name);
}
function getComponentAttributes($attrs, componentData) {
  if (!componentData) {
    return $attrs;
  }
  return Object.assign(Object.assign({}, componentData.props), componentData.attrs);
}
const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
const eventsToEmit = ['Choose', 'Unchoose', 'Sort', 'Filter', 'Clone'];
const readonlyProperties = ['Move', ...eventsListened, ...eventsToEmit].map((evt) => 'on' + evt);
// @ts-ignore
let draggingElement = null;
const props = {
  options: Object,
  list: {
    type: Array,
    required: false,
    default: null,
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false,
  },
  clone: {
    type: Function,
    default: (original) => {
      return original;
    },
  },
  tag: {
    type: String,
    default: 'div',
  },
  move: {
    type: Function,
    default: null,
  },
  componentData: {
    type: Object,
    required: false,
    default: null,
  },
  component: {
    type: String,
    default: null,
  },
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
};
export const VueDraggableNext = defineComponent({
  name: 'VueDraggableNext',
  inheritAttrs: false,
  emits: ['update:modelValue', 'move', 'change', ...eventsListened.map((s) => s.toLowerCase()), ...eventsToEmit.map((s) => s.toLowerCase())],
  props,
  data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false,
      headerOffset: 0,
      footerOffset: 0,
      _sortable: {},
      visibleIndexes: [],
      context: {},
    };
  },
  render() {
    const slots = this.$slots.default ? this.$slots.default() : null;
    const attrs = getComponentAttributes(this.$attrs, this.componentData);
    if (!slots) return h(this.getTag(), attrs, []);
    this.transitionMode = isTransition(slots);
    return h(this.getTag(), attrs, slots);
  },
  created() {
    if (this.list !== null && this.modelValue !== null) {
      console.error('list props are mutually exclusive! Please set one.');
    }
  },
  mounted() {
    const optionsAdded = {};
    eventsListened.forEach((elt) => {
      optionsAdded['on' + elt] = delegateAndEmit.call(this, elt);
    });
    eventsToEmit.forEach((elt) => {
      optionsAdded['on' + elt] = emit.bind(this, elt);
    });
    const attributes = Object.keys(this.$attrs).reduce((res, key) => {
      res[camelize(key)] = this.$attrs[key];
      return res;
    }, {});
    const options = Object.assign({}, attributes, optionsAdded, {
      onMove: (evt, originalEvent) => {
        return this.onDragMove(evt, originalEvent);
      },
    });
    !('draggable' in options) && (options.draggable = '>*');
    const targetDomElement = this.$el.nodeType === 1 ? this.$el : this.$el.parentElement;
    this._sortable = new Sortable(targetDomElement, options);
    targetDomElement.__draggable_component__ = this;
    this.computeIndexes();
  },
  beforeUnmount() {
    try {
      if (this._sortable !== undefined) this._sortable.destroy();
    } catch (error) {}
  },
  computed: {
    realList() {
      return this.list ? this.list : this.modelValue;
    },
  },
  watch: {
    $attrs: {
      handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true,
    },
    realList() {
      this.computeIndexes();
    },
  },
  methods: {
    getTag() {
      return this.component ? resolveComponent(this.component) : this.tag;
    },
    updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        const value = camelize(property);
        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },
    getChildrenNodes() {
      return this.$el.children;
    },
    computeIndexes() {
      this.$nextTick(() => {
        this.visibleIndexes = computeIndexes(this.getChildrenNodes(), this.$el.children, this.transitionMode, this.footerOffset);
      });
    },
    getUnderlyingVm(htmlElt) {
      const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);
      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }
      //@ts-ignore
      const element = this.realList[index];
      return { index, element };
    },
    emitChanges(evt) {
      this.$nextTick(() => {
        this.$emit('change', evt);
      });
    },
    alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }
      const newList = [...this.modelValue];
      onList(newList);
      this.$emit('update:modelValue', newList);
    },
    spliceList() {
      const spliceList = (list) => list.splice(...arguments);
      this.alterList(spliceList);
    },
    updatePosition(oldIndex, newIndex) {
      const updatePosition = (list) => list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      this.alterList(updatePosition);
    },
    getVmIndex(domIndex) {
      const indexes = this.visibleIndexes;
      const numberIndexes = indexes.length;
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
    },
    getComponent() {
      return this.$slots.default
        ? //@ts-ignore
          this.$slots.default()[0].componentInstance
        : null;
    },
    resetTransitionData(index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return;
      }
      var nodes = this.getChildrenNodes();
      nodes[index].data = null;
      const transitionContainer = this.getComponent();
      transitionContainer.children = [];
      transitionContainer.kept = undefined;
    },
    onDragStart(evt) {
      this.context = this.getUnderlyingVm(evt.item);
      if (!this.context) return;
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },
    onDragAdd(evt) {
      const element = evt.item._underlying_vm_;
      if (element === undefined) {
        return;
      }
      removeNode(evt.item);
      const newIndex = this.getVmIndex(evt.newIndex);
      //@ts-ignore
      this.spliceList(newIndex, 0, element);
      this.computeIndexes();
      const added = { element, newIndex };
      this.emitChanges({ added });
    },
    onDragRemove(evt) {
      insertNodeAt(this.$el, evt.item, evt.oldIndex);
      if (evt.pullMode === 'clone') {
        removeNode(evt.clone);
        return;
      }
      if (!this.context) return;
      const oldIndex = this.context.index;
      //@ts-ignore
      this.spliceList(oldIndex, 1);
      const removed = { element: this.context.element, oldIndex };
      this.resetTransitionData(oldIndex);
      this.emitChanges({ removed });
    },
    onDragUpdate(evt) {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      //@ts-ignore
      const oldIndex = this.context.index;
      const newIndex = this.getVmIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      //@ts-ignore
      const moved = { element: this.context.element, oldIndex, newIndex };
      this.emitChanges({ moved });
    },
    updateProperty(evt, propertyName) {
      evt.hasOwnProperty(propertyName) && (evt[propertyName] += this.headerOffset);
    },
    onDragMove(evt, originalEvent) {
      const onMove = this.move;
      if (!onMove || !this.realList) {
        return true;
      }
      const relatedContext = this.getRelatedContextFromMoveEvent(evt);
      const draggedContext = this.context;
      const futureIndex = this.computeFutureIndex(relatedContext, evt);
      Object.assign(draggedContext, { futureIndex });
      const sendEvt = Object.assign({}, evt, {
        relatedContext,
        draggedContext,
      });
      return onMove(sendEvt, originalEvent);
    },
    onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    },
    getTrargetedComponent(htmElement) {
      return htmElement.__draggable_component__;
    },
    getRelatedContextFromMoveEvent({ to, related }) {
      const component = this.getTrargetedComponent(to);
      if (!component) {
        return { component };
      }
      const list = component.realList;
      const context = { list, component };
      if (to !== related && list && component.getUnderlyingVm) {
        const destination = component.getUnderlyingVm(related);
        if (destination) {
          return Object.assign(destination, context);
        }
      }
      return context;
    },
    computeFutureIndex(relatedContext, evt) {
      const domChildren = [...evt.to.children].filter((el) => el.style['display'] !== 'none');
      if (domChildren.length === 0) return 0;
      const currentDOMIndex = domChildren.indexOf(evt.related);
      const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      const draggedInList = domChildren.indexOf(draggingElement) !== -1;
      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
    },
  },
});
