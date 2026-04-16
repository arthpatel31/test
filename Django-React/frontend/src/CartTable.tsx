import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface Item {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem extends Item {
  cartQuantity: number;
}

interface Props {
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  updateMainInventory: (item_id: number, change: number) => void;
}

function CartTable({ cart, setCart, updateMainInventory }: Props) {
  const increase = (product: CartItem) => {
    updateMainInventory(product.item_id, -1);

    setCart(
      cart.map((item) =>
        item.item_id === product.item_id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      )
    );
  };

  const decrease = (product: CartItem) => {
    updateMainInventory(product.item_id, +1);

    setCart(
      cart
        .map((item) =>
          item.item_id === product.item_id
            ? { ...item, cartQuantity: item.cartQuantity - 1 }
            : item
        )
        .filter((i) => i.cartQuantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.cartQuantity * item.price,
    0
  );

  return (
    <div>
      <h3 className="cart-header">Your Cart</h3>

      <table className="table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Price</th><th>Qty</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item, index) => (
            <tr key={item.item_id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.cartQuantity}</td>

              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => increase(item)}>
                  +
                </button>

                <button className="btn btn-danger btn-sm" onClick={() => decrease(item)}>
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-price-box">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}

export default CartTable;