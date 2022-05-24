本程序使用了Webpack Typescript Starter和three.js进行开发
需要本地通过npm安装three.js依赖，后访问http://localhost:3100/
效果图如下：
![image](https://user-images.githubusercontent.com/53106802/170025731-ebbce33d-8071-42fe-910f-5b2e496b2948.png)

鼠标移动到相应位置后高亮
![image](https://user-images.githubusercontent.com/53106802/170025976-a9e31283-4a47-4b4c-986f-69792093ebb7.png)

点击相应的部分会在控制台输出名称
![image](https://user-images.githubusercontent.com/53106802/170026186-4d889ee3-3e05-4501-9659-1ab10a061db7.png)

各种部件状态控制（如果不想要横切面，可以删除）
![image](https://user-images.githubusercontent.com/53106802/170026426-b878e168-b0c3-48f3-8163-e028bb06f72f.png)


一切代码全部写在application.ts中
====

获得一个开箱即用的Webpack环境。

### 使用方式
1. 克隆项目到本地
    ```shell
    git clone https://github.com/hungtcs-lab/webpack-typescript-starter.git <your-project-name>
    ```
2. 切换到项目目录
    ```shell
    cd <your-project-name>
    ```
3. 安装npm依赖，接着启动项目
    ```shell
    npm install
    npm start
    ```
4. 使用浏览器访问，默认端口为`3100`
5. _删除远程分支，或者切换为自己的仓库远程分支_
    ```shell
    // 删除远程
    git remote remove origin
    // 或者修改远程
    git remote set-url origin <url-to-your-repository>
    // 或者删除git，然后重新初始化一个新的
    rm -rf .git
    git init
    // 或者你想怎样就怎样...
    ```
