import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

interface Item {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
  image?: string;
}

interface Props {
  onAddToCart: (item: Item) => void;
}

function InventoryTableUser({ onAddToCart }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [typeSearch, setTypeSearch] = useState("");

  const fetchItems = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/items/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch items failed:", res.status, text);
        return;
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Network error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateItemInBackend = async (item: Item) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    const payload = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type,
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/items/${item.item_id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Update failed:", res.status, text);
      }
    } catch (err) {
      console.error("Network error updating item:", err);
    }
  };

  const handleAddToCart = (item: Item) => {
    if (item.quantity <= 0) return;

    const updatedItem = { ...item, quantity: item.quantity - 1 };

    setItems((prev) =>
      prev.map((i) => (i.item_id === item.item_id ? updatedItem : i))
    );

    updateItemInBackend(updatedItem);
    onAddToCart(item);
  };

  const itemsByType = useMemo(() => {
    return items.reduce<Record<string, Item[]>>((acc, item) => {
      const t = item.type || "Other";
      if (!acc[t]) acc[t] = [];
      acc[t].push(item);
      return acc;
    }, {});
  }, [items]);

  const filteredTypeEntries = useMemo(() => {
    const search = typeSearch.trim().toLowerCase();
    const entries = Object.entries(itemsByType);

    if (!search) return entries;

    return entries.filter(([type]) => type.toLowerCase().includes(search));
  }, [itemsByType, typeSearch]);

  return (
    <div className="container">
      {/* SEARCH TOP RIGHT */}
      <div className="d-flex justify-content-end mb-3">
        <div style={{ position: "relative", width: "250px" }}>
          <input
            type="text"
            className="form-control form-control-sm pe-5"
            placeholder="Search..."
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
          />

          {typeSearch && (
            <span
              className="clear-icon"
              onClick={() => setTypeSearch("")}
              title="Clear"
            >
              {/* If bootstrap icons not loaded, replace with × */}
              <i className="bi bi-x"></i>
            </span>
          )}
        </div>
      </div>

      {filteredTypeEntries.length === 0 ? (
        <p className="text-muted">No types found.</p>
      ) : (
        filteredTypeEntries.map(([type, typeItems]) => (
          <div key={type} className="mb-5">
            <h3>{type}</h3>
            <hr />

            <div className="item-grid">
              {typeItems.map((item) => (
                <div key={item.item_id} className="item-card">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="item-image" />
                  ) : (
                    <div className="item-image d-flex align-items-center justify-content-center text-muted">
                      No Image
                    </div>
                  )}

                  <h5 className="item-title">{item.name}</h5>
                  <p className="item-price">$ {item.price}</p>
                  <p className="item-qty">Available: {item.quantity}</p>

                  <button
                    className="btn btn-success btn-sm"
                    disabled={item.quantity === 0}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default InventoryTableUser;