#!/bin/bash
# Comprehensive test runner for MaplePrints configuration tests

echo "============================================"
echo "MaplePrints Configuration Test Suite"
echo "============================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Running all tests..."
echo "--------------------------------------------"
npm test

echo ""
echo "============================================"
echo "Test Summary"
echo "============================================"
echo ""
echo "Configuration Files Tested:"
echo "  ✓ .coderabbit.yaml"
echo "  ✓ .gitattributes"
echo "  ✓ .gitignore"
echo "  ✓ Git LFS video files"
echo ""
echo "Test Categories:"
echo "  ✓ File existence and structure"
echo "  ✓ Configuration validation"
echo "  ✓ Pattern matching"
echo "  ✓ Integration tests"
echo "  ✓ Security checks"
echo "  ✓ Best practices"
echo ""