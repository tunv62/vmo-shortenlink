# vmo-shortenlink
**step 1**: sau khi clone project về thì tải các package yêu câu trong file package.json
**step 2**: vào file .env sửa lại đường dẫn mongodb, và sửa nameDomain theo máy, thay đổi PORT hoặc session secret nếu muốn
**step 3**: EMAIL_SEND, EMAIL_PASSWORD_SEND là tài khoản email để gửi mail đến người đăng ký, có thể thay đổi nếu    muốn
**step 4**: sử dụng EMAIL_SEND, EMAIL_PASSWORD_SEND đăng nhập vào gmail, sau đó truy cập trang [click to access](https://console.developers.google.com )
    1. click credentials
    2. chọn edit
    3. thay đổi localhost:4000 theo domain của máy sau đó chọn save
    4. copy lại và thay đổi clientID, clientSecret nếu có thay đổi
**step 5**: Client_id và clientSecret được cấp khi đăng ký với google để làm chức năng (login with google), có thể thay đổi nếu có
**step 6**: mở terminal và npm start để chạy chương trình