pipeline{
    agent any
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
        stage('Build Client') {
            steps {
                script{
                    // Set default to staging for ticket purpose
                    def BUILD_MODE = ':develop'
                    if (env.BRANCH_NAME == 'staging'){
                        BUILD_MODE = ':staging'
                    }
                    else if (env.BRANCH_NAME == 'master'){
                        BUILD_MODE = ':master'
                    }
                    dir ('client') {
                        nodejs('Node18'){
                            sh "npm ci && npm run build${BUILD_MODE}"
                        }
                    }
                }
            }
        }
        stage('Build And Publish Images') {
            // condition to trigger this stage is only on staging branch
            when {
                anyOf {
                    branch 'staging'
                    branch 'develop'
                    branch 'master'
                }
            }
            steps{
                script{
                    def VERSION = env.BRANCH_NAME

                    // Building Docker image
                    withDockerRegistry(credentialsId: 'dockerhub', url: '') {
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
                    withDockerRegistry(credentialsId: 'dockerhub', url: '') {
                        sh "docker push avvduong/alphabeta.client:${VERSION}" // for client
                        sh "docker push avvduong/alphabeta.server:${VERSION}" // for server
                    }
                }
            }
        }
        stage('Deploy') {
            // condition to trigger this stage is only on staging branch
            when {
                anyOf {
                    branch 'staging'
                    branch 'develop'
                    branch 'master'
                }
            }
            steps{
                script{
                    def PROFILE = 'develop'
                    if (env.BRANCH_NAME == 'staging') {
                        PROFILE = 'staging'
                    }
                    else if (env.BRANCH_NAME == 'master') {
                        PROFILE = 'production'
                    }
                    withCredentials([
                        usernamePassword(credentialsId: 'vm-user', passwordVariable: 'SSH_PASSWORD', usernameVariable: 'SSH_USERNAME'),
                        usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')
                    ]) {
                        // Copy docker-compose.yaml to the remote server
                        sh "sshpass -p $SSH_PASSWORD scp -o StrictHostKeyChecking=no ./docker-compose.yaml $SSH_USERNAME@103.252.136.203:/home/alphabeta"

                        // SSH to the remote server and login to Docker Hub
                        sh "sshpass -p $SSH_PASSWORD ssh -o StrictHostKeyChecking=no $SSH_USERNAME@103.252.136.203 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'"

                        // Pull the latest Docker images and start the server
                        sh "sshpass -p $SSH_PASSWORD ssh -o StrictHostKeyChecking=no $SSH_USERNAME@103.252.136.203 'docker compose --project-name alphabeta --profile ${PROFILE} up -d --pull=always'"

                        // Logout from Docker Hub
                        sh "sshpass -p $SSH_PASSWORD ssh -o StrictHostKeyChecking=no $SSH_USERNAME@103.252.136.203 'docker logout'"
                    }
                }
            }
        }
    }
}