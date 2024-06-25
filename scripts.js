// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Validate forms on submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputs = this.querySelectorAll('input, textarea');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                alert('Please fill in all fields');
                valid = false;
            }
        });
        if (valid) {
            fetch(this.action, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(Object.fromEntries(new FormData(this)))
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Operation successful');
                        if (this.id === 'login-form') window.location.href = 'home.html';
                        else this.reset();
                    } else {
                        alert('Operation failed');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});

// Search Bar
function searchRecipes() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `recipe.html?recipeTitle=${encodeURIComponent(query)}`;
    } else {
        alert('Please enter a search term.');
    }
}

// Check Session
function checkSession() {
    fetch('/check-session')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('login-link').style.display = 'none';
                document.getElementById('signup-link').style.display = 'none';
                document.getElementById('logout-link').style.display = 'block';
            } else {
                document.getElementById('login-link').style.display = 'block';
                document.getElementById('signup-link').style.display = 'block';
                document.getElementById('logout-link').style.display = 'none';
            }
        })
        .catch(error => console.error('Error checking session:', error));
}

// Logout
function logout() {
    fetch('/logout')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'home.html';
                checkSession();
            } else {
                alert('Failed to log out.');
            }
        })
        .catch(error => console.error('Error:', error));
}