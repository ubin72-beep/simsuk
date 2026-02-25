// ========================================
// \uac80\uc0c9 \ubc0f \uc815\ub82c \uae30\ub2a5
// ========================================

// \uc81c\ud488 \uac80\uc0c9
function searchProducts() {
    const searchInput = document.getElementById('productSearchInput');
    if (!searchInput) {
        renderProductsTable(filteredProducts);
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        sortProducts(); // \uac80\uc0c9\uc5b4 \uc5c6\uc73c\uba74 \uc815\ub82c\ub9cc \uc801\uc6a9
        return;
    }
    
    const searched = filteredProducts.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm) ||
            (product.materials && product.materials.toLowerCase().includes(searchTerm)) ||
            (product.benefits && product.benefits.toLowerCase().includes(searchTerm)) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    });
    
    sortAndRenderProducts(searched);
}

// \uc81c\ud488 \uc815\ub82c
function sortProducts() {
    const sortSelect = document.getElementById('productSortSelect');
    if (!sortSelect) {
        renderProductsTable(filteredProducts);
        return;
    }
    
    sortAndRenderProducts(filteredProducts);
}

// \uc81c\ud488 \uc815\ub82c \ubc0f \ub80c\ub354\ub9c1
function sortAndRenderProducts(products) {
    const sortSelect = document.getElementById('productSortSelect');
    const sortValue = sortSelect ? sortSelect.value : 'name-asc';
    
    let sorted = [...products];
    
    switch(sortValue) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name, 'ko'));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
    }
    
    renderProductsTable(sorted);
}

// \uc8fc\ubb38 \uac80\uc0c9
function searchOrders() {
    const searchInput = document.getElementById('orderSearchInput');
    if (!searchInput) {
        displayOrders(filteredOrders);
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        sortOrders(); // \uac80\uc0c9\uc5b4 \uc5c6\uc73c\uba74 \uc815\ub82c\ub9cc \uc801\uc6a9
        return;
    }
    
    const searched = filteredOrders.filter(order => {
        return (
            order.order_number.toLowerCase().includes(searchTerm) ||
            order.customer_name.toLowerCase().includes(searchTerm) ||
            order.customer_phone.includes(searchTerm) ||
            (order.customer_email && order.customer_email.toLowerCase().includes(searchTerm))
        );
    });
    
    sortAndRenderOrders(searched);
}

// \uc8fc\ubb38 \uc815\ub82c
function sortOrders() {
    const sortSelect = document.getElementById('orderSortSelect');
    if (!sortSelect) {
        displayOrders(filteredOrders);
        return;
    }
    
    sortAndRenderOrders(filteredOrders);
}

// \uc8fc\ubb38 \uc815\ub82c \ubc0f \ub80c\ub354\ub9c1
function sortAndRenderOrders(orders) {
    const sortSelect = document.getElementById('orderSortSelect');
    const sortValue = sortSelect ? sortSelect.value : 'date-desc';
    
    let sorted = [...orders];
    
    switch(sortValue) {
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.order_date || b.created_at) - new Date(a.order_date || a.created_at));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.order_date || a.created_at) - new Date(b.order_date || b.created_at));
            break;
        case 'amount-desc':
            sorted.sort((a, b) => b.total_amount - a.total_amount);
            break;
        case 'amount-asc':
            sorted.sort((a, b) => a.total_amount - b.total_amount);
            break;
    }
    
    displayOrders(sorted);
}
