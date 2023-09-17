### 基本

## [Universal selector]

通常的使用時機為希望文件中全部元素都有同樣的 CSS 效果，例如所有文字預設都是灰色；或是有一致的字型(font-family)；或是有一致的內外邊距(margin，padding)等。

```
* {
  margin: 0;
  padding: 0;
}
```

## [box-sizing]

```
box-sizing: border-box;
```

> content-box (預設，長寛不包含邊框)
> border-box (長寛包含邊框)
