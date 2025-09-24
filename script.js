    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        import { getDatabase, ref, onChildAdded, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAUO2ZoVhSFEtAyJAP5r5zxu3kGqoIAyQ4",
            authDomain: "ordersystem-d710a.firebaseapp.com",
            databaseURL: "https://ordersystem-d710a-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "ordersystem-d710a",
            storageBucket: "ordersystem-d710a.firebasestorage.app",
            messagingSenderId: "741444965493",
            appId: "1:741444965493:web:9991535a9105035c80943c",
            measurementId: "G-4P6YQDH0LL"
          };

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        const ordersRef = ref(db, 'orders/');

        function displayOrder(order, orderId) {
            const orderContainer = document.getElementById("orders");
            const orderDiv = document.createElement("div");
            orderDiv.classList.add("order", order.status === "ready" ? "ready" : "preparing");
            if (order.status === "preparing") orderDiv.classList.add("cooking-animation");
            orderDiv.innerHTML = `
                <strong>Name:</strong> ${order.name}<br>
                <strong>Table:</strong> ${order.table}<br>
                <strong>Special Request:</strong> ${order.request}<br>
                <strong>Items:</strong> 
                <ul>
                    ${order.cart.map(item => `<li>${item.item} x ${item.quantity} - $${item.price * item.quantity}</li>`).join('')}
                </ul>
                <strong>Time:</strong> ${new Date(order.timestamp).toLocaleString()}<br>
                <strong>Status:</strong> <span id="status-${orderId}">${order.status || "preparing"}</span><br>
                <button onclick="updateStatus('${orderId}', 'ready')">Mark as Ready</button>
                <button onclick="updateStatus('${orderId}', 'preparing')">Mark as Preparing</button>
            `;
            orderDiv.id = `order-${orderId}`;
            orderContainer.prepend(orderDiv);
        }

        window.updateStatus = function(orderId, status) {
            const orderRef = ref(db, `orders/${orderId}`);
            update(orderRef, { status });
            const orderDiv = document.getElementById(`order-${orderId}`);
            orderDiv.classList.toggle("ready", status === "ready");
            orderDiv.classList.toggle("preparing", status === "preparing");
            orderDiv.classList.toggle("cooking-animation", status === "preparing");
            orderDiv.classList.toggle("ready-animation", status === "ready");
            document.getElementById(`status-${orderId}`).textContent = status;
            updateActiveOrders();
        };

        function updateActiveOrders() {
            onValue(ordersRef, snapshot => {
                let activeCount = 0;
                snapshot.forEach(childSnapshot => {
                    const order = childSnapshot.val();
                    if (order.status !== "ready") {
                        activeCount++;
                    }
                });
                document.getElementById("active-orders").textContent = `Active Orders (${activeCount})`;
            });
        }

        onChildAdded(ordersRef, snapshot => {
            const order = snapshot.val();
            displayOrder(order, snapshot.key);
            updateActiveOrders();
        });