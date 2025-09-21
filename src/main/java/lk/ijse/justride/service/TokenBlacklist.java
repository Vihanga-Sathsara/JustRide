package lk.ijse.justride.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklist {
    private final ConcurrentHashMap<String, Date> blacklist = new ConcurrentHashMap<>();

    public void addToken(String token,Date expire) {
        cleanExpiredTokens();
        blacklist.put(token, expire);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    public void cleanExpiredTokens() {
        Date now = new Date();
        blacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}
