#!/bin/bash

# Demo script to simulate load balancer testing
echo "🎬 Movie Discovery Platform - Load Balancer Demo"
echo "================================================="

# Step 1: Start two instances on different ports (simulating Web01 and Web02)
echo "Starting Web01 instance on port 8081..."
docker run -d --name movie-web01 -e TMDB_API_KEY="e1afb4b04e6e676a5e5bc9d6195b3175" -p 8081:8080 elvisk123/movie-discovery:v1

echo "Starting Web02 instance on port 8082..."
docker run -d --name movie-web02 -e TMDB_API_KEY="e1afb4b04e6e676a5e5bc9d6195b3175" -p 8082:8080 elvisk123/movie-discovery:v1

echo "Waiting for containers to start..."
sleep 5

# Step 2: Test both instances
echo ""
echo "Testing Web01 (port 8081):"
curl -s http://localhost:8081 | grep -o '<title>.*</title>' && echo " ✓ Web01 is running"

echo "Testing Web02 (port 8082):"
curl -s http://localhost:8082 | grep -o '<title>.*</title>' && echo " ✓ Web02 is running"

# Step 3: Show container status
echo ""
echo "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "Demo completed! Both instances are running and ready for load balancer configuration."
echo "To clean up: docker stop movie-web01 movie-web02 && docker rm movie-web01 movie-web02"
