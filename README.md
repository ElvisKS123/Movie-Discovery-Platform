# Movie Discovery Platform

## External API Used
Movie data provided by [TMDb API](https://developer.themoviedb.org/docs) — a popular RESTful API for global movie information.

## Features
- **Search** movies by title  
- **Filter** by genre (Action, Comedy, Drama, etc.)
- **Sort** by popularity, release date, or rating
- **Detailed view**: synopsis, cast, poster image
- **Responsive** grid layout and mobile-friendly design
- **Interactive modal** for movie details
- **Error handling**: Friendly messages for no results or API errors

## Local Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Movie-Discovery-Platform
   ```
2. Create a `config.js` file in the project root:
   ```js
   // config.js
   const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
   ```
3. Start a local server:
   ```bash
   # Python
   python3 -m http.server 8080
   # Or Node.js
   npx http-server -p 8080
   ```
4. Open [http://localhost:8080](http://localhost:8080) and use the search and filters to explore movies.

---

## Docker Image Details

**Docker Hub Repository**: https://hub.docker.com/repository/docker/elvisk123/movie-discovery

**Image Name**: `elvisk123/movie-discovery`

**Tags**:  
- `v1`  
- `latest`

---

## Build Instructions

```bash
docker build -t elvisk123/movie-discovery:v1 .
docker run -e TMDB_API_KEY="e1afb4b04e6e676a5e5bc9d6195b3175" -p 8080:8080 elvisk123/movie-discovery:v1
curl http://localhost:8080
```

---

## Deployment Instructions

### Step 1: Deploy on Web01 and Web02

```bash
# On Web01 and Web02:
docker pull elvisk123/movie-discovery:v1
docker run -d --name movie-discovery --restart unless-stopped \
  -e TMDB_API_KEY="e1afb4b04e6e676a5e5bc9d6195b3175" \
  -p 8080:8080 elvisk123/movie-discovery:v1
docker ps
curl http://localhost:8080
```

### Step 2: Configure Load Balancer (Lb01)

Edit `/etc/haproxy/haproxy.cfg`:
```
frontend web_frontend
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    option httpchk GET /
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

### Step 3: Reload HAProxy

```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

---

## Testing Steps & Evidence

1. **Direct server test:**
   ```bash
   curl http://web01:8080
   curl http://web02:8080
   ```
2. **Load balancer test:**
   ```bash
   for i in {1..10}; do
     curl -s http://localhost | grep -o '<title>.*</title>' && echo " - Request $i"
   done
   ```
3. **Logs & Screenshots:**  
   - Capture browser/terminal output showing alternating responses  
   - Save Docker logs  
   - Screenshot HAProxy stats if enabled

---

## Security Hardening

- **API Key Management:**  
  Do **not** hardcode API keys. Use environment variables or Docker secrets:
  ```bash
  docker run -d --name movie-discovery \
    -e TMDB_API_KEY="e1afb4b04e6e676a5e5bc9d6195b3175" \
    -p 8080:8080 \
    elvisk123/movie-discovery:v1
  ```

- **Further steps:**  
  - Run container as non-root user  
  - Regularly update base images  
  - Use HTTPS in production

---

# Credits
Movie data powered by [TMDb API](https://developer.themoviedb.org/docs)

---

# Website
 https://movie-discovery-platform-theta.vercel.app/

# demo video
[link video](https://www.loom.com/share/cbbc390c441e435b8dc439477939db1b?sid=3efdb14b-eb39-4dda-a233-a82f8a0ce639)
