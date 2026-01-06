#!/bin/bash
# Medusa Deployment Verification Script
# 用法: ./verify-deployment.sh <backend-url> <admin-url> <storefront-url>

set -e

BACKEND_URL="${1:-${MEDUSA_BACKEND_URL:-http://localhost:9000}}"
ADMIN_URL="${2:-${ADMIN_URL:-http://localhost:5173}}"
STOREFRONT_URL="${3:-${STOREFRONT_URL:-http://localhost:3000}}"

echo "=========================================="
echo "Medusa Deployment Verification"
echo "=========================================="
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Admin URL: $ADMIN_URL"
echo "Storefront URL: $STOREFRONT_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_endpoint() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $name ($url)... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

check_health() {
    echo "----------------------------------------"
    echo "1. Backend Health Check"
    echo "----------------------------------------"
    check_endpoint "$BACKEND_URL/health" "Health Endpoint"
}

check_store_api() {
    echo ""
    echo "----------------------------------------"
    echo "2. Store API Check"
    echo "----------------------------------------"
    
    # Check products endpoint
    check_endpoint "$BACKEND_URL/store/products" "Products API"
    
    # Check if we can list products
    echo -n "Fetching products list... "
    products=$(curl -s "$BACKEND_URL/store/products?limit=1" 2>/dev/null | grep -c "products" || echo "0")
    if [ "$products" -gt 0 ]; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${YELLOW}⚠ Empty or no products${NC}"
    fi
}

check_admin_api() {
    echo ""
    echo "----------------------------------------"
    echo "3. Admin API Check"
    echo "----------------------------------------"
    
    # Check admin auth endpoint
    check_endpoint "$BACKEND_URL/admin/auth" "Admin Auth API"
}

check_cors() {
    echo ""
    echo "----------------------------------------"
    echo "4. CORS Configuration Check"
    echo "----------------------------------------"
    
    echo "Testing CORS preflight request..."
    
    cors_result=$(curl -s -o /dev/null -w "%{http_code}" \
        -X OPTIONS \
        -H "Origin: $STOREFRONT_URL" \
        -H "Access-Control-Request-Method: GET" \
        "$BACKEND_URL/store/products" 2>/dev/null || echo "000")
    
    if [ "$cors_result" = "200" ] || [ "$cors_result" = "204" ]; then
        echo -e "${GREEN}✓ CORS OK${NC} (HTTP $cors_result)"
    else
        echo -e "${YELLOW}⚠ CORS may not be configured (HTTP $cors_result)${NC}"
    fi
}

check_database() {
    echo ""
    echo "----------------------------------------"
    echo "5. Database Connection Check"
    echo "----------------------------------------"
    
    # This would require direct database access
    echo "Skipping direct database check (requires SSH)"
    echo "Please verify manually via Medusa Admin dashboard"
}

generate_report() {
    echo ""
    echo "=========================================="
    echo "Deployment Status Report"
    echo "=========================================="
    echo ""
    echo "Date: $(date)"
    echo "Backend: $BACKEND_URL"
    echo "Admin: $ADMIN_URL"
    echo "Storefront: $STOREFRONT_URL"
    echo ""
    echo "Next Steps:"
    echo "1. ✓ If all checks passed, deployment is successful"
    echo "2. Create admin user: npx medusa user -e admin@email.com -p password"
    echo "3. Login to Admin dashboard to configure your store"
    echo "4. Add products and configure payment/shipping providers"
    echo ""
}

# Main execution
main() {
    echo "Starting deployment verification..."
    echo ""
    
    check_health
    check_store_api
    check_admin_api
    check_cors
    check_database
    
    generate_report
    
    echo "Verification complete!"
}

main "$@"
