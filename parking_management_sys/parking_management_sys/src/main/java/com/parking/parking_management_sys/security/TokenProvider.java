package com.parking.parking_management_sys.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

@Component
public class TokenProvider {
    
    // In a real application, you would use a persistent store like Redis or a database
    private final Map<String, TokenInfo> tokenStore = new HashMap<>();
    
    public String generateToken(String username, String role) {
        // Clean expired tokens
        cleanExpiredTokens();
        
        // Create a simple UUID token (in production, use a proper JWT)
        String token = UUID.randomUUID().toString();
        
        // Store token info with expiration (30 minutes from now)
        Date expiryDate = new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(30));
        tokenStore.put(token, new TokenInfo(username, role, expiryDate));
        
        return token;
    }
    
    public boolean validateToken(String token) {
        // Clean expired tokens first
        cleanExpiredTokens();
        
        TokenInfo info = tokenStore.get(token);
        return info != null;
    }
    
    public String getUsernameFromToken(String token) {
        TokenInfo info = tokenStore.get(token);
        return info != null ? info.username : null;
    }
    
    public String getRoleFromToken(String token) {
        TokenInfo info = tokenStore.get(token);
        return info != null ? info.role : null;
    }
    
    public void invalidateToken(String token) {
        tokenStore.remove(token);
    }
    
    private void cleanExpiredTokens() {
        Date now = new Date();
        tokenStore.entrySet().removeIf(entry -> entry.getValue().expiryDate.before(now));
    }
    
    // Inner class to store token information
    private static class TokenInfo {
        private final String username;
        private final String role;
        private final Date expiryDate;
        
        public TokenInfo(String username, String role, Date expiryDate) {
            this.username = username;
            this.role = role;
            this.expiryDate = expiryDate;
        }
    }
}