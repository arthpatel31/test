import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface Item {
  item_id: number;
  name: string;
  price: string;
  quantity: string;
  type: string;
  image?: string;
}

type EditBuffer = {
  name: string;
  price: string;
  quantity: string;
  type: string;
  image?: string;
};

function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [fileKey, setFileKey] = useState(0); 
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    quantity: "",
    type: "",                 
    image: null as File | null,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [edit, setEdit] = useState<EditBuffer>({
    name: "",
    price: "",
    quantity: "",
    type: "",
    image: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found. Please login.");
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

  const addItem = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found. Please login.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price.toString());
    formData.append("quantity", newItem.quantity.toString());
    formData.append("type", newItem.type); 

    if (newItem.image) {
      formData.append("image", newItem.image);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/items/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Add item failed:", res.status, text);
        return;
      }

      await res.json();
      await fetchItems();
      setNewItem({ name: "", price: "", quantity: "", type: "", image: null });
      setFileKey((k) => k + 1);
    } catch (err) {
      console.error("Network error adding item:", err);
    }
  };

  const startEdit = (item: Item) => {
    setEditingId(item.item_id);
    setEdit({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type,
      image: item.image,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdit({ name: "", price: "", quantity: "", type: "", image: "" });
  };

  const saveEdit = async (itemId: number) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found. Please login.");
      return;
    }

    const payload = {
      name: edit.name,
      price: edit.price,
      quantity: edit.quantity,
      type: edit.type,
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/items/${itemId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Save edit failed:", res.status, text);
        return;
      }

      await fetchItems();
      cancelEdit();
    } catch (err) {
      console.error("Network error saving edit:", err);
    }
  };

  const deleteItem = async (id: number) => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found. Please login.");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/items/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", res.status, text);
        return;
      }

      await fetchItems();
    } catch (err) {
      console.error("Network error deleting item:", err);
    }
  };

  return (
    <div className="container-fluid page-container">
      <h2>Admin Inventory Management</h2>

      <div className="admin-form w-50">
        <input
          className="form-control"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />

        <input
          className="form-control"
          type="text"
          placeholder="Type (e.g., Laptop)"
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
        />

        <input
          className="form-control"
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />

        <input
          className="form-control"
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />

        <input
          key={fileKey}
          type="file"
          className="form-control"
          onChange={(e) => setNewItem({ ...newItem, image: e.target.files?.[0] ?? null })}
/>

        <button className="btn btn-primary" onClick={addItem}>
          Add Item
        </button>
      </div>

      <table className="table w-75 mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const isEditing = editingId === item.item_id;

            return (
              <tr key={item.item_id}>
                <td>{index + 1}</td>

                <td>
                  {isEditing ? (
                    <input
                      className="form-control"
                      value={edit.name}
                      onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))}
                    />
                  ) : (
                    item.name
                  )}
                </td>

                <td style={{ width: 160 }}>
                  {isEditing ? (
                    <input
                      className="form-control"
                      value={edit.type}
                      onChange={(e) => setEdit((p) => ({ ...p, type: e.target.value }))}
                    />
                  ) : (
                    item.type
                  )}
                </td>

                <td style={{ width: 160 }}>
                  {isEditing ? (
                    <input
                      className="form-control"
                      type="text"
                      value={edit.price}
                      onChange={(e) => setEdit((p) => ({ ...p, price: e.target.value }))}
                    />
                  ) : (
                    `$${item.price}`
                  )}
                </td>

                <td style={{ width: 160 }}>
                  {isEditing ? (
                    <input
                      className="form-control"
                      type="text"
                      value={edit.quantity}
                      onChange={(e) => setEdit((p) => ({ ...p, quantity: e.target.value }))}
                    />
                  ) : (
                    item.quantity
                  )}
                </td>

                <td style={{ width: 140 }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>

                <td style={{ width: 240 }}>
                  {isEditing ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(item.item_id)}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.item_id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;