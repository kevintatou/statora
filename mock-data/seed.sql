
-- seed.sql

-- Component Mappings
insert into components values
  ('payments-service', 'github.com/myorg/payments', 'payments-sentry', 'payments-app', 'payments-gcp', 'payments-jira', 'Checkout Flow'),
  ('auth-service', 'github.com/myorg/auth', 'auth-sentry', 'auth-app', 'auth-gcp', 'auth-jira', 'Checkout Flow'),
  ('cart-service', 'github.com/myorg/cart', 'cart-sentry', 'cart-app', 'cart-gcp', 'cart-jira', 'Checkout Flow'),
  ('user-service', 'github.com/myorg/user', 'user-sentry', 'user-app', 'user-gcp', 'user-jira', 'User Platform'),
  ('search-service', 'github.com/myorg/search', 'search-sentry', 'search-app', 'search-gcp', 'search-jira', null);

-- DORA Metrics
insert into dora_metrics values
  ('payments-service', 5, 45, 10, 30),
  ('auth-service', 4, 90, 25, 60),
  ('cart-service', 2, 120, 30, 90),
  ('user-service', 3, 75, 15, 45),
  ('search-service', 1, 150, 40, 120);
