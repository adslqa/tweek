FROM node:8.7.0

ENV RUBY_MAJOR 2.4
ENV RUBY_VERSION 2.4.2
ENV RUBY_DOWNLOAD_SHA256 748a8980d30141bd1a4124e11745bb105b436fb1890826e0d2b9ea31af27f735
ENV RUBYGEMS_VERSION 2.6.14
ENV BUNDLER_VERSION 1.15.4
ENV GLUE_REPO omerlh
ENV GLUE_BRACNH fix_zap_alerts_bug

RUN \
cd /tmp && \
wget https://gist.githubusercontent.com/omerlh/cfe6394754788b2b0b9f836c6c238be7/raw/ec496816307a39da5030412192fa9deda9476ea7/install_ruby.sh && \
chmod +x /tmp/install_ruby.sh && \
/tmp/install_ruby.sh

RUN \
mkdir /tmp/glue && \
cd /tmp/glue && \
wget https://github.com/$GLUE_REPO/glue/archive/$GLUE_BRACNH.tar.gz && \
tar -zxvf $GLUE_BRACNH.tar.gz --strip-components=1 && \
rm -rf $GLUE_BRACNH.tar.gz && \
bundle install && \
cd ../ && \
mv glue /usr/bin/

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY . ./

RUN chmod +x test.sh && \
    wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x wait-for-it.sh

CMD ["./test.sh"]
