### Data Block <a href="https://oraksumi.blogspot.com/2020/09/55-oracle-data-block.html" target="_blank">參考網頁</a>

#### Block 是 Oracle 儲存資料最小的邏輯單位 (size 可設定為 2KB 到 32KB，預設是 8KB)

1 個 block 只能放 1 個 table 或 cluster table 的資料

結構上分成 Block Header 與 Footer

---

(a) Header: (大概佔了 100byte)

1. block_type(data_block 或 index_block)
2. block 使用率
3. ITL(Interested Transaction List):是否正在被編輯
4. data block address(ROWID)

---

(b) Footer:是實際的資料 （1 到多筆 Row）, 空間使用方式由 pctfree 與 pctused 來控制

-> **pctfree** :高於多少空間後不再用，設太大容易造成 row chain, 設太小容易造成 row migration

-> **pctused** :低於多少空間時即可再用

---

資料異動時由 ITL 來控制,
(a) initrans 表示 block 起動配置時的 ITL Slot 數量
(b) maxtrans 則表示最大可配置值

### Row

結構上分成 Row Header 與 Column Data

---

(a) Header

    1. Row overhead
    2.Number of Columns
    3.Cluster Key ID
    4.RowID of Chained Row Pieces (if any)

---

(b) Column Data  
 (基本上照著 table column 的順序排，但若有 long 型態的欄位放後面)

    1. Column Length
    2. Column Value
