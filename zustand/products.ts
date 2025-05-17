import { create } from "zustand";

interface ProductModalStore {
  isCreateProductModalOpen: boolean;
  toggleCreateProductModal: () => void;
}

const useProductModal = create<ProductModalStore>((set) => ({
  isCreateProductModalOpen: false,
  toggleCreateProductModal: () => {
    return set((state) => ({
      isCreateProductModalOpen: !state.isCreateProductModalOpen,
    }));
  },
}));

export default useProductModal;
