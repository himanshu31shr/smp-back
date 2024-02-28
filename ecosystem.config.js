module.exports = {
    apps: [{
        name: "smp-backend",
        script: "./bin/www",
        instances: "max",
        node_args: "--max-http-header-size=256000",
        max_memory_restart: '1500M',
        env_production: {
            NODE_ENV: 'production',
        },
        env_development: {
            NODE_ENV: 'development',
        },
        exec_mode: 'cluster',
        restart_delay: "500",
        merge_logs: true,
        append_env_to_name: true,
    }]
}
