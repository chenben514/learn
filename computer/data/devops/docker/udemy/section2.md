## 022. Running my App

### first app

docker build .
--> writing image sha256:5273d52871858b93f3532e00d84ba57d54c74f540b7374c30611fafcb3390c45
docker run -p 3000:80 5273d52871858b93f3532e00d84ba57d54c74f540b7374c30611fafcb3390c45
http://localhost:3000/

### docker command

1. list only live container
   > > docker ps
2. list all container
   > > docker ps -a
3. stop container
   > > docker stop jolly_kapitsa
