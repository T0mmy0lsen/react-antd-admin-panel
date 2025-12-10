import { describe, it, expect } from 'vitest';
import { TextArea } from './TextArea';
import { RadioGroup } from './Radio';
import { Switch } from './Switch';

describe('TextArea', () => {
  it('should create an instance', () => {
    const textarea = new TextArea();
    expect(textarea).toBeInstanceOf(TextArea);
  });

  it('should set rows', () => {
    const textarea = new TextArea().rows(5);
    expect((textarea as any)._config.rows).toBe(5);
  });

  it('should set maxLength', () => {
    const textarea = new TextArea().maxLength(500);
    expect((textarea as any)._config.maxLength).toBe(500);
  });

  it('should enable autoSize', () => {
    const textarea = new TextArea().autoSize({ minRows: 2, maxRows: 6 });
    expect((textarea as any)._config.autoSize).toEqual({ minRows: 2, maxRows: 6 });
  });

  it('should enable showCount', () => {
    const textarea = new TextArea().showCount();
    expect((textarea as any)._config.showCount).toBe(true);
  });

  it('should enable allowClear', () => {
    const textarea = new TextArea().allowClear();
    expect((textarea as any)._config.allowClear).toBe(true);
  });

  it('should render null when hidden', () => {
    const textarea = new TextArea().hidden(true);
    const rendered = textarea.render();
    expect(rendered).toBeNull();
  });
});

describe('RadioGroup', () => {
  it('should create an instance', () => {
    const radio = new RadioGroup();
    expect(radio).toBeInstanceOf(RadioGroup);
  });

  it('should set options', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    const radio = new RadioGroup().options(options);
    expect((radio as any)._config.options).toEqual(options);
  });

  it('should add a single option', () => {
    const radio = new RadioGroup().option('Option 1', '1');
    expect((radio as any)._config.options).toHaveLength(1);
  });

  it('should set direction', () => {
    const radio = new RadioGroup().direction('vertical');
    expect((radio as any)._config.direction).toBe('vertical');
  });

  it('should set button style', () => {
    const radio = new RadioGroup().buttonStyle('solid');
    expect((radio as any)._config.buttonStyle).toBe('solid');
  });

  it('should set option type', () => {
    const radio = new RadioGroup().optionType('button');
    expect((radio as any)._config.optionType).toBe('button');
  });

  it('should set size', () => {
    const radio = new RadioGroup().size('large');
    expect((radio as any)._config.size).toBe('large');
  });

  it('should render null when hidden', () => {
    const radio = new RadioGroup().hidden(true);
    const rendered = radio.render();
    expect(rendered).toBeNull();
  });
});

describe('Switch', () => {
  it('should create an instance', () => {
    const switchComp = new Switch();
    expect(switchComp).toBeInstanceOf(Switch);
  });

  it('should set checkedChildren', () => {
    const switchComp = new Switch().checkedChildren('ON');
    expect((switchComp as any)._config.checkedChildren).toBe('ON');
  });

  it('should set unCheckedChildren', () => {
    const switchComp = new Switch().unCheckedChildren('OFF');
    expect((switchComp as any)._config.unCheckedChildren).toBe('OFF');
  });

  it('should set size', () => {
    const switchComp = new Switch().size('small');
    expect((switchComp as any)._config.size).toBe('small');
  });

  it('should set loading state', () => {
    const switchComp = new Switch().loading();
    expect((switchComp as any)._config.loading).toBe(true);
  });

  it('should support method chaining', () => {
    const switchComp = new Switch()
      .checkedChildren('Yes')
      .unCheckedChildren('No')
      .defaultValue(false);
    
    expect((switchComp as any)._config.checkedChildren).toBe('Yes');
    expect((switchComp as any)._config.unCheckedChildren).toBe('No');
    expect(switchComp.getValue()).toBe(false);
  });

  it('should render null when hidden', () => {
    const switchComp = new Switch().hidden(true);
    const rendered = switchComp.render();
    expect(rendered).toBeNull();
  });
});
