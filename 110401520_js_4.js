document.addEventListener("DOMContentLoaded", function () {
  const checkboxAll = document.querySelector('input[name="checkbox_all"]');
  const checkboxes = document.querySelectorAll(".checkbox");
  const quantities = document.querySelectorAll(".quantity");
  const prices = document.querySelectorAll('[id^="price_"][id$="_single"]');
  const priceTotal = document.getElementById("price_total");

  function calculateTotal() {
    let total = 0;
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        const quantity = parseInt(quantities[i].value);
        const singlePrice = parseInt(prices[i].innerText.replace("$", ""));
        total += quantity * singlePrice;
      }
    }
    priceTotal.innerText = "$" + total;
    return total;
  }

  function updateCheckboxAll() {
    const checkedCount = document.querySelectorAll(".checkbox:checked").length;
    if (checkedCount === checkboxes.length) {
      checkboxAll.checked = true;
    } else {
      checkboxAll.checked = false;
    }
  }

  function toggleAllCheckboxes() {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkboxAll.checked;
    });
  }

  function handleCheckboxChange() {
    updateCheckboxAll();
    calculateTotal();
  }

  function handleCheckboxAllChange() {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checkboxAll.checked;
    });
    calculateTotal();
  }

  function updateQuantity(itemId, value) {
    const quantityInput = document.querySelector(
      `input[name="quantity_${itemId}"]`
    );
    const storage = parseInt(
      document.getElementById(`storage_${itemId}`).innerText
    );

    let quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (quantity > storage) {
      quantity = storage;
    }

    quantityInput.value = quantity;
    calculatePrice(itemId);
    calculateTotal();
  }

  function calculatePrice(itemId) {
    const quantity = parseInt(
      document.querySelector(`input[name="quantity_${itemId}"]`).value
    );
    const singlePrice = parseInt(
      document
        .getElementById(`price_${itemId}_single`)
        .innerText.replace("$", "")
    );
    const totalPrice = quantity * singlePrice;
    document.getElementById(`price_${itemId}`).innerText = "$" + totalPrice;
  }

  checkboxAll.addEventListener("change", handleCheckboxAllChange);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
      const itemId = this.name.split("_")[1];
      calculatePrice(itemId);
    });
  });

  quantities.forEach((quantity) => {
    quantity.addEventListener("blur", function () {
      const itemId = this.name.split("_")[1];
      updateQuantity(itemId, this.value);
    });
  });

  document
    .getElementById("checkout_btn")
    .addEventListener("click", function () {
      const total = calculateTotal();
      if (total > 0) {
        // 彈出結帳明細
        let checkoutDetails = "結帳明細：\n";
        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            const itemId = checkbox.name.split("_")[1];
            const itemNameElement = document.querySelector(
              `th[id="name_${itemId}"]`
            );
            const itemName = itemNameElement ? itemNameElement.innerText : "";
            const quantity = parseInt(
              document.querySelector(`input[name="quantity_${itemId}"]`).value
            );
            const singlePrice = parseInt(
              document
                .getElementById(`price_${itemId}_single`)
                .innerText.replace("$", "")
            );
            const totalPrice = quantity * singlePrice;
            checkoutDetails += `${itemName} x ${quantity}: $${totalPrice}\n`;
            // 結帳後執行操作
            const storage = parseInt(
              document.getElementById(`storage_${itemId}`).innerText
            );
            const quantityValue = parseInt(
              document.querySelector(`input[name="quantity_${itemId}"]`).value
            );
            const newQuantity = storage > quantityValue ? 1 : 0;
            document.getElementById(`storage_${itemId}`).innerText =
              storage - quantityValue;
          }
        });
        checkoutDetails += `總金額: $${total}`;
        alert(checkoutDetails);
        // 結帳後執行操作
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        quantities.forEach((quantity) => {
          const itemId = quantity.name.split("_")[1];
          const storage = parseInt(
            document.getElementById(`storage_${itemId}`).innerText
          );
          const quantityValue = parseInt(quantity.value);
          const newQuantity = storage > quantityValue ? 1 : 0;
          quantity.value = newQuantity;
        });
      }
      // 初次載入時計算價格
      prices.forEach((price) => {
        const itemId = price.id.split("_")[1];
        calculatePrice(itemId);
      });

      // 初次載入時計算總價
      calculateTotal();

      updateCheckboxAll();
    });

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const itemId = this.id.split("_")[1]; 
      
      // 禁用庫存為 0 的按鈕
 
        const storage = parseInt(
          document.getElementById(`storage_${itemId}`).innerText
        );
        if (storage === 0) {
          document.getElementById(`min`).disabled = true;
          document.getElementById(`plus`).disabled = true;
        }

      const change = this.classList.contains("minus") ? -1 : 1;
      const quantityInput = document.querySelector(
        `input[name="quantity_${itemId}"]`
      );
      const newValue = parseInt(quantityInput.value) + change;
      updateQuantity(itemId, newValue);
    });
  });


  // 初次載入時計算價格
  prices.forEach((price) => {
    const itemId = price.id.split("_")[1];
    calculatePrice(itemId);
  });

  // 初次載入時計算價格
  prices.forEach((price) => {
    const itemId = price.id.split("_")[1];
    calculatePrice(itemId);
  });

  // 初次載入時計算總價
  calculateTotal();
});