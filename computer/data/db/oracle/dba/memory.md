### Memory <a href="https://oraksumi.blogspot.com/2020/08/41-oracle.html" target="_blank">參考網頁</a>

1.  Oracle 記錄體分成了 Program Global Area (PGA) 與 System Global Area (SGA)

<img src="./computer/data/db/oracle/dba/dbarch.jpg" width="600" height="400"/>

### PGA

1. PGA 為 Process 專屬的記憶體區域，包含 Session Memory 與 Private SQL Area

   (a) Session Memory : 主要是用來存放 session 登入時的相關資訊。
   (b) Private SQL Area : 包含了 Cursor and SQL Area、Private SQL Area Components，SQL Work Area 三個部分。

   > (1) [Cursor and SQL Area] : 用來存放程式中 Cursor 的資訊，當程式執行 open cursor 時，其中的訊息將會存放在此區域，直到 cursor close。
   > (2) [Private SQL Area Components] : 包含兩個部分，The Persistent Area -- 用來存放 bind variable value，cursor close 便會釋放此空間；The runtime area -- 用來存放 Query execution state information，例如一句 SQL 執行了 full table scan，這個區域用來記錄當前 SQL 已經 scan 到哪個階段，在 SQL 執行結束後便會釋放此空間。
   > (3) [SQL Work Areas] : 當 SQL 進行一些複雜的操作時，如排序(sort)、hash-join、bitmap merge，bitmap create 等，便會使用到此空間，而這些操作大多在記憶體中完成，記憶體大小由參數 sort_area_size、hash_area_size、bitmap_merge_area_size，與 create_bitmap_area_size 所設定，若記憶體大小不足以應付時，便會使用磁碟 (temporary tablespace) 進行操作。

### SGA

1. SGA 由 Shared Pool 、Buffer Cache、Log Buffer、Large Pool、Java Pool 與 Stream Pool 所組成，每個 Pool 的大小由各個 Pool 所對應的參數所設定，全部加起來就是整體 SGA 的大小，各個 Pool 的功能如下:

   > (1) [Shared Pool] : 又分為 Library Cache 與 Dictionary Cache。Library Cache 用來存放已解析過(Parse)的 SQL 資訊，當同樣的 SQL 重複執行時，若在 Library Cache 有找到相符合的語句以及相對應的執行計畫，那麼此 SQL 就無需重新進行解析(Parse) 的動作，反之則進行解析(Parse) 然後將解析過的執行計畫存放在 Library Cache；Dictionary Cache 用來存放 Data Dictionary 的資訊，一句 SQL 除了要經過解析(Parse) 的過程外，還需要檢查 table 等物件是否存在，使用者是否有存取的權限，這些檢查都要經由 Data Dictionary 的查詢，檢查過後將相關的資訊存放於 Dictionary Cache， 加快下次 SQL 檢查的速度。Shared Pool 的大小由參數 shared_pool_size 所設定。
   > (2) [Buffer Cache] : 用來存放資料，當一句 SQL 進行查詢時，會先從 Buffer Cache 找尋資料，若 Buffer Cache 沒有相關的資料時，再直接從磁碟(Disk) 將資料取出 ，並將資料暫存於 Buffer Cache。由 Buffer Cache 讀取資料有利於降低磁碟的 I/O ，增加查詢的速度。Buffer Cache 的大小在 Oracle 9i 版本之後由參數 db_cache_size 所設定 (Oracle 8i Buffer Cache 的大小則需將兩個參數相乘 db_block_buffers \* db_block_size 所得到)。
   > (3) [Log Buffer] : 為 Redo Log 的暫存區，用來存放交易(transaction)的資訊，包含 transaction id、SQL Statement，SCN 等，由 log writer (LGWR) 這個 background process 負責清理，將資訊寫入 Redo Log。當 Log Buffer 用量達 1/3 、交易進行 commit，或是每隔 3 秒鐘 LGWR 就會將 Log Buffer 進行清理。Log Buffer 的大小由參數 log_buffer 所設定。
   > (4) [Large Pool] : 當資料庫進行大型資料操作時，例如 RMAN、DataPump...等，就會使用到此暫存區。Large Pool 的大小由參數 large_pool_size 所設定。
   > (5) [Java Pool] : 若是在資料庫運行 java code，此時就會使用到 Java Pool。Java Pool 的大小由參數 java_pool_size 所設定。
   > (6) [Stream Pool] : 當資料庫使用 Stream 這個功能時，就會使用到 Stream Pool。Stream Pool 的大小由參數 streams_pool_size 所設定。
