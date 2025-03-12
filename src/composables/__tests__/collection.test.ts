// Collection.spec.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { createCollection } from '../collection';

describe('Collection', () => {
  let collection: ReturnType<typeof createCollection<HTMLElement>>;

  beforeEach(() => {
    collection = createCollection<HTMLElement>('myCollection');
  });

  // ----------------------------------------------------------------------------------------------------
  // 📌 basic tests
  // ----------------------------------------------------------------------------------------------------

  it('should return all elements of the collection', () => {
    const templateRef1 = ref(document.createElement('div'));
    const templateRef2 = ref(document.createElement('span'));

    collection.addItem(templateRef1);
    collection.addItem(templateRef2);

    expect(collection.elements.value).toContainEqual(templateRef1.value);
    expect(collection.elements.value).toContainEqual(templateRef2.value);
  });

  // ----------------------------------------------------------------------------------------------------
  // 📌 addition tests
  // ----------------------------------------------------------------------------------------------------

  describe('add', () => {
    it('should add item to the collection', () => {
      const item = collection.addItem(ref(document.createElement('div')));

      expect(collection.items.value).toHaveLength(1);
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('templateRef');
    });

    it('should correctly set the templateRef property of the item', () => {
      const templateRef = ref(document.createElement('div'));
      const item = collection.addItem(templateRef);
      expect(item.templateRef).toBe(templateRef);
    });

    it('should correctly set the disabled property if provided', () => {
      const templateRef = ref(document.createElement('div'));
      const item = collection.addItem(templateRef, () => true);
      expect(item.disabled?.()).toBe(true);
    });

    it('should ignore disabled property if not provided', () => {
      const templateRef = ref(document.createElement('div'));
      const item = collection.addItem(templateRef);
      expect(item.disabled).toBeUndefined();
    });

    it('should retain previously added items when a item is added', () => {
      const item1 = ref(document.createElement('div'));
      const item2 = ref(document.createElement('span'));
      const item3 = ref(document.createElement('p'));
      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);
      expect(collection.elements.value).toContain(item1.value);
      expect(collection.elements.value).toContain(item2.value);
      expect(collection.elements.value).toContain(item3.value);
    });
  });

  // ----------------------------------------------------------------------------------------------------
  // 📌 removal tests
  // ----------------------------------------------------------------------------------------------------

  describe('remove', () => {
    it('should remove item from the collection', () => {
      const templateRef = ref(document.createElement('div'));
      const item = collection.addItem(templateRef);

      expect(collection.items.value).toContainEqual(item);

      collection.removeItem(templateRef);

      expect(collection.items.value).not.toContainEqual(item);
    });

    it('should decrement the count when an item is removed', () => {
      const templateRef = ref(document.createElement('div'));
      const item = collection.addItem(templateRef);
      collection.removeItem(templateRef);
      expect(collection.items.value.length).toBe(0);
    });

    it('should correctly remove the item with the specified templateRef', () => {
      const templateRef1 = ref(document.createElement('div'));
      const templateRef2 = ref(document.createElement('span'));
      const item1 = collection.addItem(templateRef1);
      const item2 = collection.addItem(templateRef2);
      collection.removeItem(templateRef1);
      expect(collection.items.value).toContain(item2);
      expect(collection.items.value).not.toContain(item1);
    });

    it('should do nothing when trying to remove an item with invalid templateRef', () => {
      const templateRef1 = ref(document.createElement('div'));
      const templateRef2 = ref(document.createElement('span'));
      const item1 = collection.addItem(templateRef1);

      expect(collection.items.value).toContain(item1);
      expect(collection.items.value.length).toBe(1);
    });
  });

  // ----------------------------------------------------------------------------------------------------
  // 📌 id tests
  // ----------------------------------------------------------------------------------------------------

  describe('id', () => {
    it('should generate incremental id for each item', () => {
      const templateRef1 = ref(document.createElement('div'));
      const templateRef2 = ref(document.createElement('div'));
      const templateRef3 = ref(document.createElement('div'));

      const item1 = collection.addItem(templateRef1);
      const item2 = collection.addItem(templateRef2);
      const item3 = collection.addItem(templateRef3);

      expect(item1.uid).toBe('myCollection-0');
      expect(item2.uid).toBe('myCollection-1');
      expect(item3.uid).toBe('myCollection-2');
    });

    it('should keep increasing id after removing items', () => {
      const templateRef1 = ref(document.createElement('div'));

      collection.addItem(templateRef1);
      collection.removeItem(templateRef1);

      // Add item and check id, id should be 'myCollection-1' not 'myCollection-0'
      const item = collection.addItem(ref(document.createElement('div')));
      expect(item.uid).toBe('myCollection-1');
    });

    it('should generate id starting with the collection name', () => {
      const customCollection = createCollection<HTMLElement>('customID');
      const item = customCollection.addItem(ref(document.createElement('div')));
      expect(item.uid.startsWith('customID')).toBe(true);
    });

    it('should generate incremental id for each collection instance separately', () => {
      // One instance
      const collection1 = createCollection<HTMLElement>('instance1');
      collection1.addItem(ref(document.createElement('div')));
      const item2 = collection1.addItem(ref(document.createElement('div')));
      expect(item2.uid).toBe('instance1-1');

      // Another instance
      const collection2 = createCollection<HTMLElement>('instance2');
      const item1inInstance2 = collection2.addItem(ref(document.createElement('div')));
      expect(item1inInstance2.uid).toBe('instance2-0');
    });

    it('should generate an id which includes the collection id', () => {
      const item = collection.addItem(ref(document.createElement('div')));
      expect(item.uid.includes('myCollection')).toBe(true);
    });
  });
});
