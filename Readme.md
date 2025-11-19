# React BEM template functions

 * [Installation](#installation)
 * [Usage](#usage)
 * [Configuring your component](#adding-the-bem-helper-to-your-components)

## Installation

`npm install @puck/react-bem`

## Usage

> [!NOTE]
> Learn how to inject the `bem` prop in [the next chapter](#adding-the-bem-helper-to-your-components)

### Simplest way to create a block with some elements

```jsx
function Acme({ bem: { className, element } }) {
  return <div className={className}>
    <h1 className={element`heading`}>Hello</h1>
  </div>
}
```

```html
<div class="acme">
  <h1 class="acme__heading">Hello</h1>
</div>
```

### BEM helper as a shorthand if there are no elements

```jsx
function Acme({ bem }) {
  return <div className={bem}>Hello</div>
}
```

```html
<div class="acme">Hello</div>
```

### Adding block modifiers

```jsx
function Acme({ bem: { block } }) {
  const [toggle, setToggle] = useState(true);
  const onClick = useCallback(
      () => setToggle(current => !current),
      [setToggle],
  );

  return <div className={block`${{ toggle }} always-enabled`}>
    <button onClick={onClick}>Toggle</button>
  </div>
}
```

```html
<div class="acme acme--toggle acme--always-enabled"/>
```


### Mixing the block with other classes

```jsx
function Acme({ bem: { block } }) {
  return <div className={block``.mix`me-2 d-flex`}>
  </div>
}
```

```html
<div class="acme me-2 d-flex">...</div>
```

### Mixing with parent block

To mix a block with a parent element just pass the element name as `className`
and it will be appended automatically

```jsx
function Child({ bem: { block } }) {
  return <div className={block`${{ active: true }}`.mix`me-2`}/> 
}

function Parent({ bem: { className, element } }) {
  return <div className={className}>
    <Child className={element`element`}/>
  </div>
}
```

```html
<div class="parent">
  <div class="child parent__element child--active me-2"/>
</div>
```


### Using elements with modifiers

```jsx
function Acme({ bem: { className, element } }) {
  return <div className={className}>
    <div className={element`item ${{ selected: true }} me-2`} />
    <div className={element`item ${{ variant: 'primary' }}`} />
    <div className={element`item ${['theme-dark']}`} />
    <div className={element`item`.mix`d-flex`} />
  </div>
}
```

```html
<div class="acme">
  <div class="acme__item acme__item--selected me-2" />
  <div class="acme__item acme__item--variant-primary" />
  <div class="acme__item acme__item--theme-dark" />
  <div class="acme__item d-flex" />
</div>
```

## Adding the BEM helper to your components

Let’s assume you have a component you’d like to use BEM with:

```tsx
type Props = {
    title: string;
}

export default function AcmeBanner({ title }: Props) {
    return <div>
        Hello {title}
    </div>;
}
```

BEM is a naming strategy, so let’s reuse the same name between your React component
display name and your CSS block name. The CSS name will be converted to `snake-case`.

1. Import the `withBem` Higher Order Component
2. Add a `displayName` to your component
3. (Typescript): Wrap your prop types with `withBem.props<>` type
4. Wrap your export in a `withBem()` HOC

```tsx
import { withBem } from '@puck/react-bem'

type Props = {
    title: string;
}

function AcmeBanner({ bem: { className }, title }: withBem.props<Props>) {
    return <div className={className}>
        Hello {title}
    </div>;
}
AcmeBanner.displayName = 'AcmeBanner';
export default withBem(AcmeBanner);
```


Optionally, you might pass the component name explicitly using `withBem.named()`:

```jsx
export default withBem.named('AcmeComponent', ({ bem, title }) => {
    return <div className={bem}>
        Hello {title}
    </div>;
});
```
