import React from 'react';
import { Row, Col, Card, Modal, Drawer } from 'antd';
import type { RowProps, ColProps, CardProps, ModalProps, DrawerProps } from 'antd';
import { BaseBuilder } from '../base/BaseBuilder';
import type { ComponentConfig } from '../types';

export interface ResponsiveBreakpoint {
  xs?: number; // <576px
  sm?: number; // ≥576px
  md?: number; // ≥768px
  lg?: number; // ≥992px
  xl?: number; // ≥1200px
  xxl?: number; // ≥1600px
}

export interface SectionConfig extends ComponentConfig {
  col?: number;
  responsive?: ResponsiveBreakpoint;
  row?: boolean;
  card?: boolean;
  cardProps?: CardProps;
  modal?: boolean;
  modalProps?: ModalProps;
  drawer?: boolean;
  drawerProps?: DrawerProps;
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  align?: 'top' | 'middle' | 'bottom';
  gutter?: number | [number, number];
  style?: React.CSSProperties;
}

/**
 * Section - Layout and composition component
 * Manages grid layout, child components, and form integration
 * 
 * @example
 * const section = new Section()
 *   .card(true)
 *   .col(12)
 *   .add(new Input().key('name').label('Name'))
 *   .add(new Input().key('email').label('Email'));
 */
export class Section extends BaseBuilder<SectionConfig> {
  public _children: Array<{ render(): React.ReactNode } | React.ReactNode> = [];
  public _rowChildren: Array<{ render(): React.ReactNode } | React.ReactNode> = [];

  /**
   * Set column span (24-grid system)
   */
  col(span: number): this {
    this._config.col = span;
    return this;
  }

  /**
   * Set responsive breakpoints for column span
   */
  responsive(breakpoints: ResponsiveBreakpoint): this {
    this._config.responsive = breakpoints;
    return this;
  }

  /**
   * Enable row layout (horizontal)
   */
  row(value: boolean = true): this {
    this._config.row = value;
    return this;
  }

  /**
   * Wrap in Card component
   */
  card(value: boolean | CardProps = true): this {
    if (typeof value === 'boolean') {
      this._config.card = value;
    } else {
      this._config.card = true;
      this._config.cardProps = value;
    }
    return this;
  }

  /**
   * Render in Modal
   */
  modal(value: boolean | ModalProps = true): this {
    if (typeof value === 'boolean') {
      this._config.modal = value;
    } else {
      this._config.modal = true;
      this._config.modalProps = value;
    }
    return this;
  }

  /**
   * Render in Drawer
   */
  drawer(value: boolean | DrawerProps = true): this {
    if (typeof value === 'boolean') {
      this._config.drawer = value;
    } else {
      this._config.drawer = true;
      this._config.drawerProps = value;
    }
    return this;
  }

  /**
   * Set row justify alignment
   */
  justify(value: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'): this {
    this._config.justify = value;
    return this;
  }

  /**
   * Set row align
   */
  align(value: 'top' | 'middle' | 'bottom'): this {
    this._config.align = value;
    return this;
  }

  /**
   * Set gutter (spacing between columns)
   */
  gutter(value: number | [number, number]): this {
    this._config.gutter = value;
    return this;
  }

  /**
   * Set custom styles
   */
  style(value: React.CSSProperties): this {
    this._config.style = value;
    return this;
  }

  /**
   * Add a child component
   */
  add(child: { render(): React.ReactNode } | React.ReactNode): this {
    // Store the builder itself, not the rendered result
    this._children.push(child);
    return this;
  }

  /**
   * Add multiple children
   */
  addMore(children: Array<{ render(): React.ReactNode } | React.ReactNode>): this {
    children.forEach(child => this.add(child));
    return this;
  }

  /**
   * Add child to row-end position
   */
  addRowEnd(child: { render(): React.ReactNode } | React.ReactNode): this {
    // Store the builder itself, not the rendered result
    this._rowChildren.push(child);
    return this;
  }

  /**
   * Clear all children
   */
  clear(): this {
    this._children = [];
    this._rowChildren = [];
    return this;
  }

  /**
   * Get all children
   */
  getChildren(): Array<{ render(): React.ReactNode } | React.ReactNode> {
    return [...this._children];
  }

  /**
   * Render method for compatibility - returns a SectionComponent
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }
    return <SectionComponent section={this} />;
  }
}

/**
 * SectionComponent - React component that renders a Section builder
 * Wrapped with React.memo to prevent unnecessary re-renders
 */
const SectionComponent = React.memo<{ section: Section }>(({ section }) => {
  if (section._config.hidden) {
    return null;
  }

  const children: Array<{ render(): React.ReactNode } | React.ReactNode> = [...section._children, ...section._rowChildren];

  // Render each child dynamically
  const renderedChildren = children.map((child, index) => {
    if (child && typeof child === 'object' && 'render' in child && typeof (child as any).render === 'function') {
      return <React.Fragment key={index}>{(child as { render(): React.ReactNode }).render()}</React.Fragment>;
    }
    return <React.Fragment key={index}>{child as React.ReactNode}</React.Fragment>;
  });

  let content: React.ReactNode;

  if (section._config.row) {
    // Row layout
    const rowProps: RowProps = {
      justify: section._config.justify,
      align: section._config.align,
      gutter: section._config.gutter,
      style: section._config.style,
    };
    content = <Row {...rowProps}>{renderedChildren}</Row>;
  } else {
    // Column layout (default)
    content = <div style={section._config.style}>{renderedChildren}</div>;
  }

  // Apply wrappers
  if (section._config.card) {
    content = <Card {...section._config.cardProps}>{content}</Card>;
  }

  if (section._config.col || section._config.responsive) {
    const colProps: ColProps = {
      span: section._config.col,
      ...section._config.responsive,
    };
    content = <Col {...colProps}>{content}</Col>;
  }

  if (section._config.modal) {
    content = (
      <Modal open={true} {...section._config.modalProps}>
        {content}
      </Modal>
    );
  }

  if (section._config.drawer) {
    content = (
      <Drawer open={true} {...section._config.drawerProps}>
        {content}
      </Drawer>
    );
  }

  return <>{content}</>;
});
