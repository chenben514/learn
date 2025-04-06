### SQL Tune

### 為什麼 SQL Perf 會變差

    • Structural changes: 表格改變
    • Changes on the data volume： 資料料變多或變少
    • Application Changes ： AP 程式改變
    • Aged Statistics ： 統計值過舊
    • Database Upgrades ： 資料庫升級
    • Database Parameter Changes ： 資料庫參數改變
    • Operating System &Hardware Changes ： 作業系統或硬體改變

### Bad SQL 的特徵

    • Unnecessary parse time
    • Unnecessary l/O operations
    • Unnecessary CPU tim
    • Unnecessarywaits

### Schema Design

    • 同樣的欄位，在不同 table 要一致
    • 正規化設計
    • Table Partition 可避免 range scan 時採 full table scan

### SQL Process

    1. Syntax Check
    2. Semantic Check
    3. Privilege Check
    4. Allocate private SQL Area
    5. Exist shared SQL Area
        (a) yes - soft parse
        (b) no - allocate shared SQL area / optimize / row source generation



    • 正規化設計
    • Table Partition 可避免 range scan 時採 full table scan
