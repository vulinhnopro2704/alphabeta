pipeline{
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub'
        SSH_CREDENTIALS_ID = 'vm-user'
        SSH_HOST = '103.252.136.203'
        DOCKER_REGISTRY_URL = ''
    }
    stages{
        // Config based on your current branch name
        stage('Build & Test Server') {
            steps{
                dir ('server'){
                    withGradle {
                        // Give permission for ./gradlew
                        sh 'chmod +x gradlew'

                        // Run the actual build & test for our server
                        sh './gradlew build'
                    }
                }
            }
        }
        stage("Restore npm packages") {
            steps {
                // Writes lock-file to cache based on the GIT_COMMIT hash
                writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

                cache(caches: [
                    arbitraryFileCache(
                        path: "node_modules",
                        includes: "**/*",
                        cacheValidityDecidingFile: "package-lock.json"
                    )
                ]) {
                    sh "npm ci"
                }
            }
        }

        stage("Build") {
            steps {
                // Writes lock-file to cache based on the GIT_COMMIT hash
                writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

                cache(caches: [
                    arbitraryFileCache(
                        path: ".next/cache",
                        includes: "**/*",
                        cacheValidityDecidingFile: "next-lock.cache"
                    )
                ]) {
                    // aka `next build`
                    sh "npm run build"
                }
            }
        }

        stage('Build And Publish Images') {
            // condition to trigger this stage is only on develop or main branch
//             when {
//                 anyOf {
//                     branch 'develop'
//                     branch 'main'
//                 }
//             }
            steps{
                script{
                    def VERSION = env.BRANCH_NAME

                    // Building Docker image
                    withDockerRegistry(credentialsId: DOCKER_CREDENTIALS_ID, url: DOCKER_REGISTRY_URL) {
                        // For Client
                        dir('client'){
                            sh "docker build . -t avvduong/alphabeta.client:${VERSION}"
                        }

                        // For Server
                        dir('server'){
                            sh "docker build . -t avvduong/alphabeta.server:${VERSION}"
                        }
                    }

                    // Publishing images
                    withDockerRegistry(credentialsId: DOCKER_CREDENTIALS_ID, url: DOCKER_REGISTRY_URL) {
                        sh "docker push avvduong/alphabeta.client:${VERSION}" // for client
                        sh "docker push avvduong/alphabeta.server:${VERSION}" // for server
                    }
                }
            }
        }
        stage('Deploy') {
            // condition to trigger this stage is only on develop or main branch
//             when {
//                 anyOf {
//                     branch 'develop'
//                     branch 'main'
//                 }
//             }
            steps{
                script{
                    def PROFILE = 'develop'
                    if (env.BRANCH_NAME == 'main') {
                        PROFILE = 'production'
                    }
                    withCredentials([
                        usernamePassword(credentialsId: SSH_CREDENTIALS_ID, passwordVariable: 'SSH_PASSWORD', usernameVariable: 'SSH_USERNAME'),
                        usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')
                    ]) {
                        // Copy docker-compose.yaml to the remote server
                        sh "sshpass -p $SSH_PASSWORD scp -o StrictHostKeyChecking=no ./docker-compose.yaml $SSH_USERNAME@$SSH_HOST:/home/alphabeta"

                        // SSH to the remote server and login to Docker Hub
                        sh "sshpass -p $SSH_PASSWORD ssh -o StrictHostKeyChecking=no $SSH_USERNAME@$SSH_HOST 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'"

                        // Pull the latest Docker images and start the server
                        sh "sshpass -p $SSH_PASSWORD ssh -o StrictHostKeyChecking=no $SSH_USERNAME@$SSH_HOST 'docker compose --project-name alphabeta --profile ${PROFILE} up -d --pull=always'"

                        // Logout from Docker Hub
                        sh "sshpass -p $SSH_PASSWORD ssh -o StrictHostKeyChecking=no $SSH_USERNAME@$SSH_HOST 'docker logout'"
                    }
                }
            }
        }
    }
    post {
        // Clean after build/
        always {
            cleanWs()
        }
    }
}