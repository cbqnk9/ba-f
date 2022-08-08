package com.error504.baf.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class ReviewComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "BOOLEAN")
    private Boolean isAnonymous;

    private LocalDateTime createDate;

    @ManyToOne
    private Review review;

    @ManyToOne
    private SiteUser author;

    @OneToMany(mappedBy = "reviewComment", cascade = CascadeType.REMOVE)
    private List<ReviewChildComment> reviewChildCommentsList;

    @ManyToMany
    Set<SiteUser> voter;
}
