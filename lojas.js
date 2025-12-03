 const products = [
        {
          id: 1,
          name: "Geladeira Frost Free 450L",
          category: "geladeira",
          price: 2899,
          desc: "Inox, baixo consumo",
          stock: 5,
        },
        {
          id: 2,
          name: "Fogão 5 bocas Touch",
          category: "fogao",
          price: 1299,
          desc: "Forno autolimpante",
          stock: 8,
        },
        {
          id: 3,
          name: "Máquina de Lavar 12kg",
          category: "lava",
          price: 1999,
          desc: "Econômica com 15 programas",
          stock: 4,
        },
        {
          id: 4,
          name: "Micro-ondas 30L",
          category: "micro",
          price: 499,
          desc: "Potência alta, grill",
          stock: 12,
        },
        {
          id: 5,
          name: 'Smart TV 50" 4K',
          category: "tv",
          price: 2299,
          desc: "Smart TV com HDR",
          stock: 6,
        },
        {
          id: 6,
          name: "Geladeira Compacta 220L",
          category: "geladeira",
          price: 1699,
          desc: "Perfeita para cozinha pequena",
          stock: 10,
        },
        {
          id: 7,
          name: "Fogão Portátil 2 bocas",
          category: "fogao",
          price: 199,
          desc: "Ideal para áreas externas",
          stock: 20,
        },
        {
          id: 8,
          name: "Secadora 8kg",
          category: "lava",
          price: 1799,
          desc: "Secagem rápida",
          stock: 3,
        },
      ];

      const CART_KEY = "loja_cart_v1";
      let cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}");

      const productsGrid = document.getElementById("productsGrid");
      const resultsCount = document.getElementById("resultsCount");
      const cartCount = document.getElementById("cartCount");
      const yearEl = document.getElementById("year");
      yearEl.textContent = new Date().getFullYear();

      function moneyBR(amount) {
        return amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      function renderProducts(list) {
        productsGrid.innerHTML = "";
        list.forEach((p) => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
          <div class="thumb">${p.category.toUpperCase()}</div>
          <h4 class="product-title">${p.name}</h4>
          <div class="meta">${p.desc}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <div>
              <div class="price">${moneyBR(p.price)}</div>
              <div class="meta">Em estoque: ${p.stock}</div>
            </div>
            <div style="width:38%">
              <button class="add" data-id="${p.id}">Adicionar</button>
              <button class="fav" style="margin-top:8px">Favoritar</button>
            </div>
          </div>
        `;
          productsGrid.appendChild(card);
        });
        resultsCount.textContent = list.length;

        document.querySelectorAll(".add").forEach((b) =>
          b.addEventListener("click", () => {
            const id = b.getAttribute("data-id");
            addToCart(Number(id));
          })
        );
      }

      function addToCart(productId) {
        const prod = products.find((p) => p.id === productId);
        if (!prod) return;
        const key = String(productId);
        cart[key] = cart[key]
          ? { ...cart[key], qty: cart[key].qty + 1 }
          : { id: productId, qty: 1, price: prod.price, name: prod.name };
        persistCart();
        updateCartCount();
        toast("Adicionado ao carrinho — " + prod.name);
      }

      function persistCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
      }

      function updateCartCount() {
        const total = Object.values(cart).reduce((s, i) => s + i.qty, 0);
        cartCount.textContent = total;
      }

      function openCart() {
        const tpl = document.getElementById("cartTemplate");
        const clone = tpl.content.cloneNode(true);
        document.body.appendChild(clone);
        renderCartItems();
        document
          .getElementById("closeCartBtn")
          .addEventListener("click", closeCart);
        document
          .getElementById("cartOverlay")
          .addEventListener("click", (e) => {
            if (e.target.id === "cartOverlay") closeCart();
          });
        document.getElementById("checkoutBtn").addEventListener("click", () => {
          alert("Checkout simulado — Obrigado pela preferência!");
          cart = {};
          persistCart();
          updateCartCount();
          closeCart();
        });
      }

      function closeCart() {
        const ov = document.getElementById("cartOverlay");
        if (ov) ov.remove();
      }

      function renderCartItems() {
        const container = document.getElementById("cartItems");
        container.innerHTML = "";
        const items = Object.values(cart);
        if (items.length === 0) {
          container.innerHTML = "<p>Seu carrinho está vazio.</p>";
          document.getElementById("cartTotal").textContent = moneyBR(0);
          return;
        }
        let sum = 0;
        items.forEach((it) => {
          const prod = products.find((p) => p.id === it.id);
          const line = document.createElement("div");
          line.style.display = "flex";
          line.style.justifyContent = "space-between";
          line.style.marginBottom = "10px";
          line.innerHTML = `<div><strong>${
            it.name
          }</strong><div class='meta'>${moneyBR(it.price)} x ${
            it.qty
          }</div></div><div style='text-align:right'><div style='font-weight:700'>${moneyBR(
            it.price * it.qty
          )}</div><div style='margin-top:6px'><button data-id='${
            it.id
          }' class='dec'>-</button> <button data-id='${
            it.id
          }' class='inc'>+</button> <button data-id='${
            it.id
          }' class='rem'>Remover</button></div></div>`;
          container.appendChild(line);
          sum += it.price * it.qty;
        });
        document.getElementById("cartTotal").textContent = moneyBR(sum);

        container.querySelectorAll(".inc").forEach((b) =>
          b.addEventListener("click", () => {
            changeQty(b.dataset.id, 1);
          })
        );
        container.querySelectorAll(".dec").forEach((b) =>
          b.addEventListener("click", () => {
            changeQty(b.dataset.id, -1);
          })
        );
        container.querySelectorAll(".rem").forEach((b) =>
          b.addEventListener("click", () => {
            removeItem(b.dataset.id);
          })
        );
      }

      function changeQty(id, delta) {
        const key = String(id);
        if (!cart[key]) return;
        cart[key].qty += delta;
        if (cart[key].qty <= 0) delete cart[key];
        persistCart();
        renderCartItems();
        updateCartCount();
      }

      function removeItem(id) {
        delete cart[String(id)];
        persistCart();
        renderCartItems();
        updateCartCount();
      }

      const chips = document.getElementById("categoryChips");
      chips.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        Array.from(chips.querySelectorAll(".chip")).forEach(
          (c) => (c.style.boxShadow = "none")
        );
        chip.style.boxShadow = "0 4px 14px rgba(11,116,222,0.08)";
        const cat = chip.dataset.cat;
        applyFilters({ category: cat });
      });

      const searchInput = document.getElementById("searchInput");
      const sortSelect = document.getElementById("sortSelect");
      searchInput.addEventListener("input", () => applyFilters());
      sortSelect.addEventListener("change", () => applyFilters());

      function applyFilters({ category } = {}) {
        const q = searchInput.value.trim().toLowerCase();
        const cat =
          category ||
          document.querySelector('.chip[style*="box-shadow"]')?.dataset?.cat ||
          "all";
        let list = products.filter(
          (p) =>
            (cat === "all" || p.category === cat) &&
            (p.name.toLowerCase().includes(q) ||
              p.desc.toLowerCase().includes(q))
        );

        const s = sortSelect.value;
        if (s === "price-asc") list.sort((a, b) => a.price - b.price);
        if (s === "price-desc") list.sort((a, b) => b.price - a.price);
        renderProducts(list);
      }

      function toast(msg) {
        const t = document.createElement("div");
        t.textContent = msg;
        t.style.position = "fixed";
        t.style.right = "18px";
        t.style.bottom = "18px";
        t.style.background = "black";
        t.style.color = "white";
        t.style.padding = "10px 12px";
        t.style.borderRadius = "8px";
        t.style.zIndex = 9999;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2200);
      }

      document
        .getElementById("openCartBtn")
        .addEventListener("click", openCart);
      updateCartCount();
      renderProducts(products);
  