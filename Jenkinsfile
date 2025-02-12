pipeline {
    agent any
    
    tools {
        nodejs 'Nodejs16'  // Tên đã cấu hình ở trên
    }
    
    environment {
        BUILD_START_TIME = ''
    }
    
    stages {
        stage('Setup Metrics Directory') {
            steps {
                sh 'mkdir -p metrics'
            }
        }
        
        stage('Start Tracking') {
            steps {
                script {
                    BUILD_START_TIME = System.currentTimeMillis()
                }
            }
        }
        
       
         stage('Backend Build & Test') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()
                    
                    dir('eCommerceAPI') {  
                        sh 'node -v'  // Kiểm tra version Node.js
                        sh 'npm -v'   // Kiểm tra npm
                        sh 'npm install'
                        sh 'npm test --passWithNoTests || true'
                        sh 'CI=false npm run'
                    }
                    
                    def duration = System.currentTimeMillis() - startTime
                    writeFile file: 'ecomResource/metrics/backend-build.txt', text: duration.toString()
                }
            }
        }
        stage('Generate Report') {
            steps {
                script {
                    def report = """
                        Pipeline Report
                        ==============
                         Backend Build: ${readFile('ecomResource/metrics/backend-build.txt').trim()}ms
                     
                    """.stripIndent()
                    
                    writeFile file: 'pipeline-report.md', text: report
                }
            }
        }
        stage('Monitor Resources') {
    steps {
        script {
            // CPU Usage
            def cpuUsage = sh(script: 'top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\'', returnStdout: true).trim()
            
            // Memory Usage
            def memUsage = sh(script: 'free -m | awk \'NR==2{printf "%.2f", $3*100/$2 }\'', returnStdout: true).trim()
            
            // Disk Usage
            def diskUsage = sh(script: 'df -h / | awk \'NR==2{print $5}\'', returnStdout: true).trim()
            
            // Lưu metrics
            writeFile file: 'ecomResource/metrics/resources.txt', text: """
                CPU: ${cpuUsage}%
                Memory: ${memUsage}%
                Disk: ${diskUsage}
            """
        }
    }
}
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'metrics/**, pipeline-report.md', fingerprint: true
        }
    }
}