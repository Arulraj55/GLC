FROM php:8.2-apache

# Install system dependencies and SSL libraries
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    zip \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_mysql

# Remove the current MongoDB extension installation
RUN pecl uninstall mongodb

# Install the compatible version (1.21.x)
RUN pecl install mongodb-1.21.1 && \
    docker-php-ext-enable mongodb

# Verify MongoDB extension is enabled
RUN php -m | grep -i mongodb

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Fix permissions before install
RUN chown -R www-data:www-data /var/www/html

# Run composer install with correct user
USER www-data
RUN composer install --no-interaction --no-dev --prefer-dist

# Switch back to root
USER root

# Expose port
EXPOSE 80