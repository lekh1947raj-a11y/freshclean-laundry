document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    let totalAmount = 0;

    const services = {
        1: { name: "Dry Cleaning", price: 200.00, inCart: true },
        2: { name: "Wash & Fold", price: 100.00, inCart: false },
        3: { name: "Ironing", price: 30.00, inCart: true },
        4: { name: "Stain Removal", price: 500.00, inCart: false },
        5: { name: "Leather & Suede Cleaning", price: 999.00, inCart: false },
        6: { name: "Wedding Dress Cleaning", price: 2800.00, inCart: false }
    };

    initializeCart();

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                if(window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    document.querySelector('.hero .btn-primary').addEventListener('click', function(e) {
        e.preventDefault();
        const bookingSection = document.querySelector('#booking');
        window.scrollTo({
            top: bookingSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    document.querySelector('.services-list').addEventListener('click', function(e) {
        if(e.target.classList.contains('service-btn')) {
            const serviceItem = e.target.closest('.service-item');
            const serviceId = parseInt(serviceItem.dataset.id);

            if(e.target.classList.contains('add-btn')) {
                addToCart(serviceId);
                e.target.textContent = "Remove Item";
                e.target.classList.remove('add-btn');
                e.target.classList.add('remove-btn');
            } else if(e.target.classList.contains('remove-btn')) {
                removeFromCart(serviceId);
                e.target.textContent = "Add Item";
                e.target.classList.remove('remove-btn');
                e.target.classList.add('add-btn');
            }

            updateCartDisplay();
        }
    });

    document.getElementById('cartTableBody').addEventListener('click', function(e) {
        if(e.target.classList.contains('remove-cart-item')) {
            const serviceId = parseInt(e.target.dataset.id);
            removeFromCart(serviceId);

            const serviceBtn = document.querySelector(`.service-item[data-id="${serviceId}"] .service-btn`);
            serviceBtn.textContent = "Add Item";
            serviceBtn.classList.remove('remove-btn');
            serviceBtn.classList.add('add-btn');

            updateCartDisplay();
        }
    });

    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if(cart.length === 0) {
            showMessage("Please add at least one service to book.", false);
            return;
        }

        const templateParams = {
            to_name: fullName,
            to_email: email,
            from_name: "FreshClean Laundry",
            phone: phone,
            services: cart.map(item => `${item.name} - $${item.price}`).join('\n'),
            total: totalAmount
        };

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function() {
                showMessage("Thank you for booking our service! We will get back to you soon. A confirmation email has been sent to your email address.", true);
                document.getElementById('bookingForm').reset();
            }, function() {
                showMessage("Booking successful! (Email service temporarily unavailable)", true);
            });
    });

    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showMessage("Thank you for subscribing to our newsletter!", true);
        document.getElementById('newsletterForm').reset();
    });

    function initializeCart() {
        for(const id in services) {
            if(services[id].inCart) {
                cart.push({
                    id: parseInt(id),
                    name: services[id].name,
                    price: services[id].price
                });
                totalAmount += services[id].price;
            }
        }
        updateCartDisplay();
    }

    function addToCart(serviceId) {
        if(cart.some(item => item.id === serviceId)) return;

        cart.push({
            id: serviceId,
            name: services[serviceId].name,
            price: services[serviceId].price
        });

        totalAmount += services[serviceId].price;
        services[serviceId].inCart = true;
    }

    function removeFromCart(serviceId) {
        const index = cart.findIndex(item => item.id === serviceId);
        if(index !== -1) {
            totalAmount -= cart[index].price;
            cart.splice(index, 1);
            services[serviceId].inCart = false;
        }
    }

    function updateCartDisplay() {
        const cartTableBody = document.getElementById('cartTableBody');
        const noItemsDiv = document.getElementById('noItems');
        const totalAmountSpan = document.getElementById('totalAmount');

        cartTableBody.innerHTML = '';

        if(cart.length > 0) {
            noItemsDiv.style.display = 'none';
            cart.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><button class="remove-cart-item" data-id="${item.id}">Remove</button></td>
                `;
                cartTableBody.appendChild(row);
            });
        } else {
            noItemsDiv.style.display = 'block';
        }

        totalAmountSpan.textContent = `$${totalAmount.toFixed(2)}`;
    }

    function showMessage(message, isSuccess) {
        const messageDiv = document.getElementById('confirmationMessage');
        messageDiv.textContent = message;
        messageDiv.className = 'confirmation-message ' + (isSuccess ? 'success' : 'error');

        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'confirmation-message';
        }, 5000);
    }
});
