import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from 'react';
import { Typography, message, Card, Switch, Space, Divider, Badge, Descriptions, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, StarOutlined, } from '@ant-design/icons';
import { List, Section } from 'react-antd-admin-panel';
const { Title, Text, Paragraph } = Typography;
// Generate sample data
const generateProducts = () => {
    const categories = ['electronics', 'clothing', 'books', 'food'];
    const statuses = ['active', 'draft', 'archived'];
    const names = [
        'Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Hub',
        'Cotton T-Shirt', 'Denim Jeans', 'Running Shoes', 'Winter Jacket',
        'JavaScript Guide', 'React Cookbook', 'TypeScript Handbook', 'Node.js Patterns',
        'Organic Coffee', 'Green Tea', 'Dark Chocolate', 'Protein Bars'
    ];
    return names.map((name, index) => ({
        id: String(index + 1),
        name,
        image: `https://picsum.photos/seed/${index + 1}/100/100`,
        category: categories[index % 4],
        price: Math.round((Math.random() * 200 + 10) * 100) / 100,
        stock: Math.floor(Math.random() * 500),
        status: statuses[Math.floor(Math.random() * 3)],
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        sales: Math.floor(Math.random() * 1000),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: `High quality ${name.toLowerCase()} with excellent features and great customer reviews.`,
        sku: `SKU-${String(index + 1).padStart(4, '0')}`,
    }));
};
function AdvancedListPage() {
    const [products] = useState(generateProducts);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showVirtual, setShowVirtual] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = !searchQuery ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);
    // Simulate refresh - memoized to prevent unnecessary re-renders
    const handleRefresh = useCallback(async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        message.success('Products refreshed!');
    }, []);
    // Generate large dataset for virtual scrolling demo
    const largeDataset = useMemo(() => {
        if (!showVirtual)
            return filteredProducts;
        // Generate 1000 items for virtual scrolling demo
        return Array.from({ length: 1000 }, (_, i) => ({
            ...filteredProducts[i % filteredProducts.length],
            id: String(i + 1),
            name: `${filteredProducts[i % filteredProducts.length].name} #${i + 1}`,
        }));
    }, [filteredProducts, showVirtual]);
    // CRITICAL: Memoize the List builder to prevent re-creation on every render
    // This is essential for virtual scrolling performance
    const productList = useMemo(() => {
        const list = new List()
            .rowKey('id')
            .dataSource(showVirtual ? largeDataset : filteredProducts)
            .loading(loading)
            // Header with all controls
            .header({
            title: showVirtual ? `Products (${largeDataset.length} items - Virtual)` : `Products (${filteredProducts.length})`,
            showSearch: true,
            searchPlaceholder: 'Search by name or SKU...',
            onSearch: (query) => setSearchQuery(query),
            showCreate: true,
            createLabel: 'Add Product',
            onCreate: () => message.info('Create new product clicked!'),
            showRefresh: true,
            onRefresh: handleRefresh,
            extra: (_jsxs(Space, { children: [_jsx(Text, { children: "Virtual Scroll:" }), _jsx(Switch, { checked: showVirtual, onChange: setShowVirtual, checkedChildren: "ON", unCheckedChildren: "OFF" })] })),
        })
            // Enable selection with bulk actions
            .selectable('checkbox')
            .bulkAction('activate', 'Activate', (rows) => {
            message.success(`Activated ${rows.length} products`);
        }, { icon: _jsx(CheckCircleOutlined, {}) })
            .bulkAction('archive', 'Archive', (rows) => {
            message.warning(`Archived ${rows.length} products`);
        }, { icon: _jsx(CloseCircleOutlined, {}) })
            .bulkAction('delete', 'Delete', (rows) => {
            message.error(`Deleted ${rows.length} products`);
        }, { danger: true, confirm: `Delete selected products? This cannot be undone.` })
            // Columns with various types - explicit widths required for virtual scrolling
            .column('name', 'Product Name', {
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
        })
            .column('sku', 'SKU', { width: 120 })
            .tagColumn('category', 'Category', {
            electronics: 'blue',
            clothing: 'purple',
            books: 'orange',
            food: 'green',
        }, { width: 120 })
            .column('price', 'Price', (price) => (_jsxs(Text, { strong: true, children: ["$", price.toFixed(2)] })), { width: 100 })
            .column('stock', 'Stock', (stock) => (_jsx(Badge, { status: stock > 100 ? 'success' : stock > 20 ? 'warning' : 'error', text: stock.toString() })), { width: 100 })
            .tagColumn('status', 'Status', {
            active: 'green',
            draft: 'default',
            archived: 'red',
        }, { width: 100 })
            .column('rating', 'Rating', (rating) => (_jsxs(Space, { children: [_jsx(StarOutlined, { style: { color: '#faad14' } }), _jsx(Text, { children: rating.toFixed(1) })] })), { width: 100 })
            .dateColumn('createdAt', 'Created', 'relative', { width: 130 })
            .size('middle')
            .emptyText('No products match your search criteria');
        // Virtual scrolling or pagination (not both - they don't mix well)
        // Also, expandable rows don't work well with virtual scrolling
        if (showVirtual) {
            // For virtual scrolling: 
            // 1. scroll.x and scroll.y MUST be NUMBER types
            // 2. Avoid complex cell renderers (Tooltips, Popconfirms) - they create many DOM elements
            // 3. Disable sticky for better performance
            // 4. Use simpler actions without tooltips/confirms
            list
                .action('view', '👁', (record) => {
                message.info(`Viewing: ${record.name}`);
            })
                .action('edit', '✏️', (record) => {
                message.info(`Editing: ${record.name}`);
            })
                .virtual(500, 1100) // height=500, scrollX=total column widths (must be number!)
                .pagination(false);
        }
        else {
            // For paginated mode: use full-featured actions with tooltips and confirms
            list
                .action('view', 'View', (record) => {
                message.info(`Viewing: ${record.name}`);
            }, { icon: _jsx(EyeOutlined, {}), tooltip: 'View product details' })
                .action('edit', 'Edit', (record) => {
                message.info(`Editing: ${record.name}`);
            }, { icon: _jsx(EditOutlined, {}), tooltip: 'Edit product' })
                .action('delete', 'Delete', (record) => {
                message.success(`Deleted: ${record.name}`);
            }, {
                icon: _jsx(DeleteOutlined, {}),
                danger: true,
                confirm: 'Are you sure you want to delete this product?',
                tooltip: 'Delete product',
            })
                .bordered(true)
                .sticky(true);
            // Expandable rows with product details (only when not using virtual scroll)
            list.expandableRow((record) => (_jsx(Card, { size: "small", style: { margin: '8px 0' }, children: _jsxs(Descriptions, { column: 3, size: "small", children: [_jsx(Descriptions.Item, { label: "SKU", children: record.sku }), _jsx(Descriptions.Item, { label: "Category", children: record.category }), _jsx(Descriptions.Item, { label: "Status", children: record.status }), _jsxs(Descriptions.Item, { label: "Price", children: ["$", record.price.toFixed(2)] }), _jsxs(Descriptions.Item, { label: "Stock", children: [record.stock, " units"] }), _jsxs(Descriptions.Item, { label: "Sales", children: [record.sales, " sold"] }), _jsx(Descriptions.Item, { label: "Description", span: 3, children: record.description }), _jsx(Descriptions.Item, { label: "Sales Progress", span: 3, children: _jsx(Progress, { percent: Math.min(100, Math.round(record.sales / 10)), status: record.sales > 500 ? 'success' : 'active', style: { width: 300 } }) })] }) })), () => true);
            list.pagination({
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} products`,
            });
        }
        return list;
    }, [showVirtual, largeDataset, filteredProducts, loading, handleRefresh]);
    // Category filter buttons
    const categoryFilter = new Section()
        .row(true)
        .gutter(8)
        .style({ marginBottom: 16 })
        .add(_jsxs(Space, { children: [_jsx(Text, { strong: true, children: "Filter by Category:" }), ['all', 'electronics', 'clothing', 'books', 'food'].map(cat => (_jsx(Badge, { count: cat === 'all'
                    ? products.length
                    : products.filter(p => p.category === cat).length, size: "small", offset: [-5, 0], children: _jsx("button", { onClick: () => setSelectedCategory(cat === 'all' ? null : cat), style: {
                        padding: '4px 12px',
                        border: `1px solid ${selectedCategory === cat || (cat === 'all' && !selectedCategory) ? '#1890ff' : '#d9d9d9'}`,
                        borderRadius: 4,
                        background: selectedCategory === cat || (cat === 'all' && !selectedCategory) ? '#e6f7ff' : 'white',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                    }, children: cat }) }, cat)))] }));
    // Feature showcase info
    const featureInfo = new Section()
        .card({ title: '🚀 Advanced List Features Demonstrated' })
        .style({ marginBottom: 16 })
        .add(_jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs(Paragraph, { children: ["This page showcases all the advanced features of the ", _jsx(Text, { code: true, children: "List" }), " builder:"] }), _jsxs(Space, { wrap: true, children: [_jsx(Badge, { status: "success", text: "Header Controls (Search, Create, Refresh)" }), _jsx(Badge, { status: "success", text: "Row Selection with Bulk Actions" }), _jsx(Badge, { status: "success", text: "Expandable Rows with Details" }), _jsx(Badge, { status: "success", text: "Confirm Dialogs on Actions" }), _jsx(Badge, { status: "success", text: "Virtual Scrolling (toggle above)" }), _jsx(Badge, { status: "success", text: "Custom Column Renderers" }), _jsx(Badge, { status: "success", text: "Sorting & Filtering" }), _jsx(Badge, { status: "success", text: "Sticky Header" })] }), _jsx(Divider, { style: { margin: '12px 0' } }), _jsx(Text, { type: "secondary", children: "Try: Search products \u2022 Select rows for bulk actions \u2022 Expand rows to see details \u2022 Toggle virtual scrolling for 1000 items \u2022 Click action buttons" })] }));
    return (_jsxs("div", { children: [_jsx(Title, { level: 3, children: "Advanced List Demo" }), featureInfo.render(), categoryFilter.render(), productList.render()] }));
}
export default AdvancedListPage;
