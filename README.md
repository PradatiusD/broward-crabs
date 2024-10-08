This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Backend

## Details
- Port: 8099
- Database: MongoDB
- Database: Redis

## API 
### POST: /v1/traffic  -> Save a `list` of traffic data in the form of 
```
[
    {
        "CreateTime": String,
        "Signal": String,
        "Address": String,
        "Location": Option<String>,
        "Grid": String,
        "MapX": Option<f64>,
        "MapY": Option<f64>,
        "Longitude": f64,
        "Latitude": f64,
    }
]
```



### GET: /v1/traffic/id -> Get the matching traffic data with the `id`

### POST: /v1/weather -> Get the weather data using the form
```
{
	"Longitude": f64,
	"Latitude": f64,
}
```

### GET: /v1/health_check -> Is the server running?

### POST: /v1/ai -> Get the AI prediction using the form
```
{
	"question": String,
}
```

### POST: /v1/get_past_weather -> Get the past weather data using the form
```
{
	"days_previous": i64,
	"query_index": u16
}
```

### POST: /v1/user -> Creates a new user using the form
```
{
	"username": String,
	"password": String,
	"email": String,
}
```

### GET: /v1/user/id -> Get the user data with the `id`


### PUT: /v1/user/id -> Update a user using the form
```
{
	"username": String,
	"password": String,
	"email": String,
}
```

### DELETE: /v1/user/id -> Delete the user with the `id`

### GET: /v1/users -> Get all the users
