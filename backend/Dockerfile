FROM php:8.5-cli-alpine

RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    libpq \
    libpq-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    && docker-php-ext-install pdo_pgsql pgsql \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/html

COPY . /var/www/html

RUN composer install --no-interaction --prefer-dist --no-progress --no-scripts \
    && chmod -R 755 storage bootstrap/cache \
    && chmod +x docker-entrypoint.sh

EXPOSE 8000

CMD ["bash", "./docker-entrypoint.sh"]