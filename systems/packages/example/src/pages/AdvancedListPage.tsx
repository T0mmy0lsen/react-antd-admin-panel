import { useState, useMemo, useCallback } from 'react';
import { Typography, message, Card, Switch, Space, Divider, Badge, Descriptions, Progress } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { List, Section } from 'react-antd-admin-panel';

const { Title, Text, Paragraph } = Typography;

// Sample product data for demonstration
interface Product {
  id: string;
  name: string;
  image: string;
  category: 'electronics' | 'clothing' | 'books' | 'food';
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  rating: number;
  sales: number;
  createdAt: string;
  description: string;
  sku: string;
}

// Generate sample data
const generateProducts = (): Product[] => {
  const categories: Product['category'][] = ['electronics', 'clothing', 'books', 'food'];
  const statuses: Product['status'][] = ['active', 'draft', 'archived'];
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
    category: categories[index % 4]!,
    price: Math.round((Math.random() * 200 + 10) * 100) / 100,
    stock: Math.floor(Math.random() * 500),
    status: statuses[Math.floor(Math.random() * 3)]!,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    sales: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    description: `High quality ${name.toLowerCase()} with excellent features and great customer reviews.`,
    sku: `SKU-${String(index + 1).padStart(4, '0')}`,
  }));
};

function AdvancedListPage() {
  const [products] = useState<Product[]>(generateProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVirtual, setShowVirtual] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    if (!showVirtual) return filteredProducts;
    // Generate 1000 items for virtual scrolling demo
    return Array.from({ length: 1000 }, (_, i) => ({
      ...filteredProducts[i % filteredProducts.length]!,
      id: String(i + 1),
      name: `${filteredProducts[i % filteredProducts.length]!.name} #${i + 1}`,
    }));
  }, [filteredProducts, showVirtual]);

  // CRITICAL: Memoize the List builder to prevent re-creation on every render
  // This is essential for virtual scrolling performance
  const productList = useMemo(() => {
    const list = new List<Product>()
      .rowKey('id')
      .dataSource(showVirtual ? largeDataset : filteredProducts)
      .loading(loading)
      // Header with all controls
      .header({
        title: showVirtual ? `Products (${largeDataset.length} items - Virtual)` : `Products (${filteredProducts.length})`,
        showSearch: true,
        searchPlaceholder: 'Search by name or SKU...',
        onSearch: (query: string) => setSearchQuery(query),
        showCreate: true,
        createLabel: 'Add Product',
        onCreate: () => message.info('Create new product clicked!'),
        showRefresh: true,
        onRefresh: handleRefresh,
        extra: (
          <Space>
            <Text>Virtual Scroll:</Text>
            <Switch 
              checked={showVirtual} 
              onChange={setShowVirtual}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </Space>
        ),
      })
      // Enable selection with bulk actions
      .selectable('checkbox')
      .bulkAction('activate', 'Activate', (rows: Product[]) => {
        message.success(`Activated ${rows.length} products`);
      }, { icon: <CheckCircleOutlined /> })
      .bulkAction('archive', 'Archive', (rows: Product[]) => {
        message.warning(`Archived ${rows.length} products`);
      }, { icon: <CloseCircleOutlined /> })
      .bulkAction('delete', 'Delete', (rows: Product[]) => {
        message.error(`Deleted ${rows.length} products`);
      }, { danger: true, confirm: `Delete selected products? This cannot be undone.` })
      // Columns with various types - explicit widths required for virtual scrolling
      .column('name', 'Product Name', {
        width: 200,
        sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      })
      .column('sku', 'SKU', { width: 120 })
      .tagColumn('category', 'Category', {
        electronics: 'blue',
        clothing: 'purple',
        books: 'orange',
        food: 'green',
      }, { width: 120 })
      .column('price', 'Price', (price: number) => (
        <Text strong>${price.toFixed(2)}</Text>
      ), { width: 100 })
      .column('stock', 'Stock', (stock: number) => (
        <Badge 
          status={stock > 100 ? 'success' : stock > 20 ? 'warning' : 'error'} 
          text={stock.toString()} 
        />
      ), { width: 100 })
      .tagColumn('status', 'Status', {
        active: 'green',
        draft: 'default',
        archived: 'red',
      }, { width: 100 })
      .column('rating', 'Rating', (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{rating.toFixed(1)}</Text>
        </Space>
      ), { width: 100 })
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
        .action('view', '👁', (record: Product) => {
          message.info(`Viewing: ${record.name}`);
        })
        .action('edit', '✏️', (record: Product) => {
          message.info(`Editing: ${record.name}`);
        })
        .virtual(500, 1100) // height=500, scrollX=total column widths (must be number!)
        .pagination(false);
    } else {
      // For paginated mode: use full-featured actions with tooltips and confirms
      list
        .action('view', 'View', (record: Product) => {
          message.info(`Viewing: ${record.name}`);
        }, { icon: <EyeOutlined />, tooltip: 'View product details' })
        .action('edit', 'Edit', (record: Product) => {
          message.info(`Editing: ${record.name}`);
        }, { icon: <EditOutlined />, tooltip: 'Edit product' })
        .action('delete', 'Delete', (record: Product) => {
          message.success(`Deleted: ${record.name}`);
        }, { 
          icon: <DeleteOutlined />, 
          danger: true, 
          confirm: 'Are you sure you want to delete this product?',
          tooltip: 'Delete product',
        })
        .bordered(true)
        .sticky(true);
      // Expandable rows with product details (only when not using virtual scroll)
      list.expandableRow(
        (record: Product) => (
          <Card size="small" style={{ margin: '8px 0' }}>
            <Descriptions column={3} size="small">
              <Descriptions.Item label="SKU">{record.sku}</Descriptions.Item>
              <Descriptions.Item label="Category">{record.category}</Descriptions.Item>
              <Descriptions.Item label="Status">{record.status}</Descriptions.Item>
              <Descriptions.Item label="Price">${record.price.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Stock">{record.stock} units</Descriptions.Item>
              <Descriptions.Item label="Sales">{record.sales} sold</Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {record.description}
              </Descriptions.Item>
              <Descriptions.Item label="Sales Progress" span={3}>
                <Progress 
                  percent={Math.min(100, Math.round(record.sales / 10))} 
                  status={record.sales > 500 ? 'success' : 'active'}
                  style={{ width: 300 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ),
        () => true
      );
      list.pagination({
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total: number, range: [number, number]) => 
          `Showing ${range[0]}-${range[1]} of ${total} products`,
      });
    }

    return list;
  }, [showVirtual, largeDataset, filteredProducts, loading, handleRefresh]);

  // Category filter buttons
  const categoryFilter = new Section()
    .row(true)
    .gutter(8)
    .style({ marginBottom: 16 })
    .add(
      <Space>
        <Text strong>Filter by Category:</Text>
        {['all', 'electronics', 'clothing', 'books', 'food'].map(cat => (
          <Badge 
            key={cat}
            count={cat === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat).length
            }
            size="small"
            offset={[-5, 0]}
          >
            <button
              onClick={() => setSelectedCategory(cat === 'all' ? null : cat)}
              style={{
                padding: '4px 12px',
                border: `1px solid ${selectedCategory === cat || (cat === 'all' && !selectedCategory) ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: 4,
                background: selectedCategory === cat || (cat === 'all' && !selectedCategory) ? '#e6f7ff' : 'white',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {cat}
            </button>
          </Badge>
        ))}
      </Space>
    );

  // Feature showcase info
  const featureInfo = new Section()
    .card({ title: '🚀 Advanced List Features Demonstrated' })
    .style({ marginBottom: 16 })
    .add(
      <Space direction="vertical" style={{ width: '100%' }}>
        <Paragraph>
          This page showcases all the advanced features of the <Text code>List</Text> builder:
        </Paragraph>
        <Space wrap>
          <Badge status="success" text="Header Controls (Search, Create, Refresh)" />
          <Badge status="success" text="Row Selection with Bulk Actions" />
          <Badge status="success" text="Expandable Rows with Details" />
          <Badge status="success" text="Confirm Dialogs on Actions" />
          <Badge status="success" text="Virtual Scrolling (toggle above)" />
          <Badge status="success" text="Custom Column Renderers" />
          <Badge status="success" text="Sorting & Filtering" />
          <Badge status="success" text="Sticky Header" />
        </Space>
        <Divider style={{ margin: '12px 0' }} />
        <Text type="secondary">
          Try: Search products • Select rows for bulk actions • Expand rows to see details • 
          Toggle virtual scrolling for 1000 items • Click action buttons
        </Text>
      </Space>
    );

  return (
    <div>
      <Title level={3}>Advanced List Demo</Title>
      {featureInfo.render()}
      {categoryFilter.render()}
      {productList.render()}
    </div>
  );
}

export default AdvancedListPage;