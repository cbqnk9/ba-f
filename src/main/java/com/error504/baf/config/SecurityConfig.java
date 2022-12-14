package com.error504.baf.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {


    private String[] staticResources = {"images/**"};
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/user/login").permitAll()
                .antMatchers("/user/signup").permitAll()
                .antMatchers(staticResources).permitAll()
                .antMatchers("/question/**").hasAnyAuthority("ROLE_ADMIN","USER_AUTH")
//                .antMatchers("/question/**").hasAuthority("USER_AUTH")
                .antMatchers("/board/**").hasAnyAuthority("ROLE_ADMIN","USER_AUTH")
                .antMatchers("/review/create").authenticated()
                .antMatchers("/community/home").authenticated()


                .antMatchers("/management/**").hasAuthority("ROLE_ADMIN")

                .and()
                .formLogin()
                .loginPage("/user/login")
                .defaultSuccessUrl("/review")

                .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/user/logout"))
                .logoutSuccessUrl("/user/login")
                .invalidateHttpSession(true);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();

    }

    @Bean
    public AuthenticationManager authenticationManager (AuthenticationConfiguration authenticationConfiguration) throws
            Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
