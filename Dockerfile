# 1. ベースイメージとしてNode.jsを使用
FROM node:22.12

# 2. 作業ディレクトリを設定
WORKDIR /usr/src/app

# 3. package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. ソースコードをコンテナ内にコピー
COPY . .

# 6. Reactアプリケーションを起動
CMD ["npm", "start"]

# 7. Reactアプリがリッスンするポートを公開
EXPOSE 3000