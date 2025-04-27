# 🛒 Advanced React Shopping Cart

This project is a fully functional shopping cart application built with **React**, **TypeScript**, and **Vite**. It demonstrates modern React development practices, including state management with **Redux Toolkit**, data fetching with **React Query**, and session storage for persistence.

## 🚀 Features

- **Dynamic Product Listing**: Fetch and display products from the FakeStoreAPI.
- **Category Filtering**: Dynamically filter products by category.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Session Storage**: Persist cart data across browser sessions.
- **Checkout**: Simulate a checkout process with cart clearing.
- **React Query**: Efficient data fetching and caching.
- **Redux Toolkit**: Centralized state management for the shopping cart.
- **Interactive UI**: Includes modals, toasts, and fun animations for a better user experience.

---

## 🛠️ Technologies Used

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Strongly typed JavaScript for better code quality.
- **Vite**: Fast development build tool.
- **Redux Toolkit**: State management for the shopping cart.
- **React Query**: Data fetching and caching.
- **Bootstrap**: Styling and responsive design.
- **FakeStoreAPI**: Mock API for product data.

---

## 📂 Folder Structure

```
src/
├── components/         # React components (Home, ShoppingCart)
├── redux/              # Redux Toolkit slices and store
├── services/           # API service functions
├── types/              # Shared TypeScript interfaces
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.html          # HTML template
```

---

## ⚙️ Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/advanced-react-shopping-cart.git
cd advanced-react-shopping-cart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser to view the application.

---

## 🛒 Usage Instructions

### **Home Page**
- Browse products and filter them by category using the dropdown menu.
- Add products to the shopping cart by clicking the "Add to Cart" button.

### **Shopping Cart**
- View items in the cart, including their quantity and total price.
- Remove individual items or clear the entire cart during checkout.

### **Checkout**
- Simulate a checkout process by clicking the "Checkout" button.
- The cart will be cleared, and a fun emoji animation will appear to celebrate the purchase.

---

## 🧪 Testing the Application

### **1. Add Products to Cart**
- Add multiple products to the cart and verify that the cart count updates dynamically.

### **2. Filter Products**
- Select a category from the dropdown and ensure that only products from that category are displayed.

### **3. Checkout**
- Click the "Checkout" button and verify that the cart is cleared and the emoji animation appears.

### **4. Session Persistence**
- Refresh the page and confirm that the cart data persists across sessions.

---

## 🔧 Expanding the ESLint Configuration

This project includes a minimal ESLint setup. For production applications, consider expanding the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature-name"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- [FakeStoreAPI](https://fakestoreapi.com/) for providing mock product data.
- [Vite](https://vitejs.dev/) for the fast development experience.
- [Redux Toolkit](https://redux-toolkit.js.org/) for simplifying state management.
- [React Query](https://tanstack.com/query/latest) for efficient data fetching.

---

Enjoy building with **React + TypeScript + Vite**! 🎉

[Dub5991](https://github.com/Dub5991)  
