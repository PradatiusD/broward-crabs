FROM rust:1.81

WORKDIR /app

ENV APP_ENVIRONMENT=production

COPY . .

RUN cargo build --release

CMD ["./target/release/backend"]
EXPOSE 8099

