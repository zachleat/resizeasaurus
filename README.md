# resizeasaurus

A web component to add resizing behavior to test intrinsically sized responsive components.

## Install

```
npm install @zachleat/resizeasaurus --save
```

## Demo

* [https://resizeasaurus.zachleat.dev/](https://resizeasaurus.zachleat.dev/)

## Usage

```
<resize-asaurus>
	My component goes here
</resize-asaurus>
```

Add the `disabled` attribute to disable the component behavior (and hide its styling).

```
<resize-asaurus disabled>
	My component goes here
</resize-asaurus>
```

Add the `label="disabled"` attribute to disable the live width text.

```
<resize-asaurus label="disabled">
	My component goes here
</resize-asaurus>
```
