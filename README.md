<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Run in Development

1. Clone the repository
2. Run
```
yarn install
```

3. Make sure you have Nest CLI installed
```
npm i -g @nestjs/cli
```

4. Start the database
```
docker-compose up -d
```

5. Copy the ```.env.template``` file and rename the copy to ```.env```

6. Fill in the environment variables defined in ```.env```

7. Run the application in development: 
```
yarn start:dev
```

8. Rebuild the database with the seed
```
http://localhost:3000/api/v2/seed
```

## Stack used
* NestJS
* MongoDB

## Production Build
1. Create the ```.env.prod``` file
2. Fill in the production environment variables
3. Build the new image
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
