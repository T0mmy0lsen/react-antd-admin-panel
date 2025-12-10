import { describe, it, expect, vi } from 'vitest';
import { Section } from './Section';
import { render } from '@testing-library/react';
import React from 'react';

describe('Section', () => {
  describe('Basic Configuration', () => {
    it('should create section with default config', () => {
      const section = new Section();
      expect(section.getConfig()).toBeDefined();
    });

    it('should set column span', () => {
      const section = new Section().col(12);
      expect(section.getConfig().col).toBe(12);
    });

    it('should enable row layout', () => {
      const section = new Section().row(true);
      expect(section.getConfig().row).toBe(true);
    });

    it('should set responsive breakpoints', () => {
      const section = new Section().responsive({ xs: 24, sm: 12, md: 8 });
      expect(section.getConfig().responsive).toEqual({ xs: 24, sm: 12, md: 8 });
    });
  });

  describe('Wrappers', () => {
    it('should enable card wrapper', () => {
      const section = new Section().card(true);
      expect(section.getConfig().card).toBe(true);
    });

    it('should enable card with props', () => {
      const section = new Section().card({ title: 'Test Card' });
      expect(section.getConfig().card).toBe(true);
      expect(section.getConfig().cardProps?.title).toBe('Test Card');
    });

    it('should enable modal wrapper', () => {
      const section = new Section().modal(true);
      expect(section.getConfig().modal).toBe(true);
    });

    it('should enable drawer wrapper', () => {
      const section = new Section().drawer({ title: 'Test' });
      expect(section.getConfig().drawer).toBe(true);
      expect(section.getConfig().drawerProps?.title).toBe('Test');
    });
  });

  describe('Layout Configuration', () => {
    it('should set justify alignment', () => {
      const section = new Section().justify('center');
      expect(section.getConfig().justify).toBe('center');
    });

    it('should set align', () => {
      const section = new Section().align('middle');
      expect(section.getConfig().align).toBe('middle');
    });

    it('should set gutter as number', () => {
      const section = new Section().gutter(16);
      expect(section.getConfig().gutter).toBe(16);
    });

    it('should set gutter as array', () => {
      const section = new Section().gutter([16, 24]);
      expect(section.getConfig().gutter).toEqual([16, 24]);
    });

    it('should set custom styles', () => {
      const section = new Section().style({ padding: '20px' });
      expect(section.getConfig().style).toEqual({ padding: '20px' });
    });
  });

  describe('Child Management', () => {
    it('should add single child component', () => {
      const section = new Section();
      const child = { render: () => React.createElement('div', {}, 'Child') };
      section.add(child);
      expect(section.getChildren()).toHaveLength(1);
    });

    it('should add React node directly', () => {
      const section = new Section();
      section.add(React.createElement('div', {}, 'Direct child'));
      expect(section.getChildren()).toHaveLength(1);
    });

    it('should add multiple children', () => {
      const section = new Section();
      const children = [
        { render: () => React.createElement('div', {}, 'Child 1') },
        { render: () => React.createElement('div', {}, 'Child 2') },
      ];
      section.addMore(children);
      expect(section.getChildren()).toHaveLength(2);
    });

    it('should add child to row end', () => {
      const section = new Section();
      const child = { render: () => React.createElement('button', {}, 'Submit') };
      section.addRowEnd(child);
      expect(section.getChildren()).toHaveLength(0); // Row children tracked separately
    });

    it('should clear all children', () => {
      const section = new Section();
      section.add(React.createElement('div'));
      section.addRowEnd(React.createElement('button'));
      section.clear();
      expect(section.getChildren()).toHaveLength(0);
    });
  });

  describe('Rendering', () => {
    it('should render simple section', () => {
      const section = new Section().add(React.createElement('div', {}, 'Content'));
      const result = section.render();
      expect(result).toBeDefined();
    });

    it('should render hidden section as null', () => {
      const section = new Section().hidden(true).add(React.createElement('div'));
      const result = section.render();
      expect(result).toBeNull();
    });

    it('should render row layout', () => {
      const section = new Section()
        .row(true)
        .add(React.createElement('div', {}, 'Item 1'))
        .add(React.createElement('div', {}, 'Item 2'));
      
      const result = section.render();
      expect(result).toBeDefined();
    });

    it('should render with card wrapper', () => {
      const section = new Section()
        .card({ title: 'Test' })
        .add(React.createElement('div', {}, 'Content'));
      
      const result = section.render();
      expect(result).toBeDefined();
    });

    it('should render with column wrapper', () => {
      const section = new Section()
        .col(12)
        .add(React.createElement('div', {}, 'Content'));
      
      const result = section.render();
      expect(result).toBeDefined();
    });
  });

  describe('Method Chaining', () => {
    it('should chain all methods fluently', () => {
      const section = new Section()
        .col(12)
        .responsive({ xs: 24, md: 12 })
        .row(true)
        .card(true)
        .justify('center')
        .align('middle')
        .gutter(16)
        .style({ padding: '10px' })
        .add(React.createElement('div'))
        .addMore([React.createElement('span')])
        .addRowEnd(React.createElement('button'));

      expect(section).toBeInstanceOf(Section);
      expect(section.getConfig().col).toBe(12);
      expect(section.getConfig().card).toBe(true);
    });
  });
});
