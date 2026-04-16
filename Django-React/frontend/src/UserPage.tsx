import { useState } from "react";
import InventoryTableUser from "./InventoryTableUser";
import CartTable from "./CartTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const token = localStorage.getItem("access");

interface Item {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem extends Item {
  cartQuantity: number;
}

function UserPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.item_id === item.item_id);

      if (exists) {
        return prev.map((p) =>
          p.item_id === item.item_id
            ? { ...p, cartQuantity: p.cartQuantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, cartQuantity: 1 }];
    });
  };

  const updateMainInventory = (item_id: number, change: number) => {
  fetch(`http://127.0.0.1:8000/api/v1/items/${item_id}/`)
    .then((res) => res.json())
    .then((item) => {
      const newQuantity = item.quantity + change;

      const cleanData = {
        name: item.name,
        price: item.price,
        quantity: newQuantity
      };

      return fetch(`http://127.0.0.1:8000/api/v1/items/${item_id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(cleanData),
      });
    });
};

  return (
    <div className="container-fluid page-container">
      <h2>User Shopping Page</h2>

      <InventoryTableUser onAddToCart={addToCart} />

      <CartTable
        cart={cart}
        setCart={setCart}
        updateMainInventory={updateMainInventory}
      />
    </div>
  );
}

export default UserPage;