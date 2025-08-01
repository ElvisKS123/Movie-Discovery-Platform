#!/bin/sh

# Inject environment variables into the JavaScript files
if [ -n "$TMDB_API_KEY" ]; then
    echo "Injecting TMDB API key into application..."
    # Create a script tag that sets the environment variable
    cat > /usr/share/nginx/html/env.js << EOF
window.ENV_TMDB_API_KEY = '$TMDB_API_KEY';
EOF
else
    echo "Warning: TMDB_API_KEY environment variable not set!"
    cat > /usr/share/nginx/html/env.js << EOF
window.ENV_TMDB_API_KEY = 'YOUR_API_KEY_HERE';
EOF
fi

# Execute the original command
exec "$@"
