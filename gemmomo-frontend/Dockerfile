FROM node:18-alpine

WORKDIR /app

COPY . .

# 환경 변수 파일 복사 (배포용)
COPY .env.production .env.production

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
